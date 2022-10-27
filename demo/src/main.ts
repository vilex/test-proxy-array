import { button, createApp, div, hr, input, li, ref, span, store } from "vilex"
import { fulllist, wordart } from "./widgets"
import './normal.css'



const arr = [1, 2, 3]



const whitelist = ['push', 'pop', 'splice', 'shift', 'unshfit']

let methodName = ''
let starts = []
let start = -1
let len = 0
let news = []
const arrProxy = new Proxy(arr, {
    get(target, p, receiver) {
        console.log('get', p)
        if (typeof p === 'string') {
            if (whitelist.includes(p)) {
                methodName = p
            }
        }
        return Reflect.get(target, p, receiver)
    },
    set(target, p, newValue, receiver) {
        console.log(methodName, 'set', p, newValue)
        if (p !== 'length') {
            if (methodName === 'push') {
                onPush(newValue)
            }
            else
                if (methodName === 'shift') {
                    onShift()
                    methodName = ''
                }
                else
                    if (methodName === 'splice') {
                        starts.push(Number(p))
                        start = Number(p)
                        len++
                        news.push(newValue)
                    }
        }
        else {
            if (methodName === 'splice') {
                // if (Reflect.get(target, p) - news.length) {
                //     // 代码插入几个？
                // }
                const index = news.length - Reflect.get(target, p)
                const nnnew = news.slice(-len)
                console.log(`news`, nnnew)
                console.log(Reflect.get(target, p))
                onSplice(Math.min(...starts), len, news)
            }
        }

        return Reflect.set(target, p, newValue, receiver)
    },
    deleteProperty(target, p) {
        console.log('del', p)
        return Reflect.deleteProperty(target, p)
    },


})




const app = div(
    {
        fontSize: '30px'
    },
    arrProxy.map(item => li(item.toString()))
)


function onPush(val) {
    app.add(li(val.toString()))
}

function onShift() {
    app.remove(app.children[0])
}

function onSplice(start, len, newItems) {

    console.error(`splice`, start, len, newItems)

    console.log(arrProxy.length)
}

// arrProxy.push(4)
// arrProxy.shift()
arrProxy.splice(0, 1, 1, 3)


createApp(app).mount('#app')