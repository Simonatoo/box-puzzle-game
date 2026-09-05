/**
 * Relay for the pxt-sockets extension (https://github.com/pelikhan/pxt-sockets).
 * The Arcade simulator runs sandboxed and can't open real WebSocket connections,
 * so it posts "wss" sim messages here, this page (not sandboxed) opens the real
 * socket, and forwards events back into the simulator.
 *
 * "disableTargetTemplateFiles": true is set in pxt.json so MakeCode won't
 * overwrite this file.
 */
document.addEventListener("DOMContentLoaded", function () {
    const CHANNEL = "wss"
    const CLOSE_MESSAGE = 1 << 0;
    const MESSAGE_MESSAGE = 1 << 1;
    const OPEN_MESSAGE = 1 << 2;
    const ERROR_MESSAGE = 1 << 3;
    const STRING_DATA = 1 << 4;
    const BUFFER_DATA = 1 << 5;

    let sockets = {};

    function uint8ArrayToString(input) {
        let res = ""
        for (let i = 0; i < input.length; ++i)
            res += String.fromCharCode(input[i]);
        return res;
    }

    function simPostMessage(msg) {
        const frame = document.getElementById("simframe");
        if (frame && frame.contentWindow) {
            frame.contentWindow.postMessage(msg, "*");
        } else {
            console.log("[wss] simframe not found, could not deliver message", msg)
        }
    }

    const proxy = data => {
        simPostMessage({
            type: 'messagepacket',
            channel: CHANNEL,
            data
        });
    }

    function openSocket(id, url) {
        console.log(`[wss] opening socket ${id} -> ${url}`)
        if (sockets[id]) {
            sockets[id].close();
            delete sockets[id];
        }
        const ws = sockets[id] = new WebSocket(url);
        ws.onerror = (e) => {
            console.log(`[wss] socket ${id} error`, e)
            if (sockets[id] !== ws) return;
            const data = new Uint8Array([ERROR_MESSAGE, id])
            proxy(data)
        }
        ws.onopen = () => {
            console.log(`[wss] socket ${id} open`)
            if (sockets[id] !== ws) return;
            const data = new Uint8Array([OPEN_MESSAGE, id]);
            proxy(data)
        }
        ws.onclose = (e) => {
            console.log(`[wss] socket ${id} closed`, e.code)
            if (sockets[id] !== ws) return;
            const code = e.code;
            const data = new Uint8Array([CLOSE_MESSAGE, id, (code >> 24) & 0xff, (code >> 16) & 0xff, (code >> 8) & 0xff, code & 0xff]);
            proxy(data)
        }
        ws.onmessage = async (e) => {
            if (sockets[id] !== ws) return;

            let d = e.data;
            const isstring = typeof d === "string";
            if (!isstring) {
                if (ws.binaryType === "blob") {
                    d = await d.arrayBuffer();
                }
                d = new Uint8Array(d);
            }
            const data = new Uint8Array(2 + d.length);
            data[0] = MESSAGE_MESSAGE | (isstring ? STRING_DATA : BUFFER_DATA);
            data[1] = id;
            if (isstring) {
                for (let i = 0; i < d.length; ++i)
                    data[i + 2] = d.charCodeAt(i);
            } else {
                for (let i = 0; i < d.length; ++i)
                    data[i + 2] = d[i];
            }
            proxy(data)
        }
    }

    addSimMessageHandler("wss", (msg) => {
        console.log("[wss] received sim message", msg)
        const type = msg[0]
        const id = msg[1];

        if (type === OPEN_MESSAGE) {
            const url = uint8ArrayToString(msg.slice(2))
            openSocket(id, url)
        } else if ((type & MESSAGE_MESSAGE) == MESSAGE_MESSAGE) {
            const socket = sockets[id];
            if (!socket) {
                console.log(`[wss] no socket for id ${id}, dropping message`)
                return;
            }
            let data = msg.slice(2);
            if ((type & STRING_DATA) === STRING_DATA)
                data = uint8ArrayToString(data);
            console.log(`[wss] sending to socket ${id}:`, data)
            socket.send(data);
        }
    })

    window.addEventListener('message', function (ev) {
        const d = ev.data
        if (d.type === "simulator" && d.command === "restart") {
            const temp = sockets;
            sockets = {};
            Object.keys(temp).forEach(id => {
                try {
                    temp[id].close();
                } catch (e) { }
            });
        }
    });
})
