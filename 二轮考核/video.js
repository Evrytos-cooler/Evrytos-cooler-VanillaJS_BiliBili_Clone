const urlParams = new URLSearchParams(window.location.search);
const response = JSON.parse(urlParams.get('src'));
const i = urlParams.get('current')
console.log(response)//直接浏览器url传参，好像不太好样子，

//获取元素
const title = document.querySelector('.content .left .title')
const info = document.querySelector('.content .left .info')
const video = document.querySelector('.content .left video')

//渲染元素
title.innerText = response.videos[i].title
video.setAttribute('src', `${response.videos[i].videoSrc}`)


// up主模块
const upAvata = document.querySelector('.content .right .upInfo .infoLeft .avata')
const upName = document.querySelector('.content .right .upInfo .infoRight .name')
const upDescription = document.querySelector('.content .right .upInfo .infoRight .description')
upAvata.style.backgroundImage = `url(${response.videos[i].authorAvatarSrc})`
upName.innerText = response.videos[i].author
console.log(response.videos[i].author)


// 弹幕列表
const listHead = document.querySelector('.content .right .barrageList .listHead')
const barrageList = document.querySelector('.content .right .barrageList')
const barrageListContent = document.querySelector('.content .right .barrageList ul')

listHead.addEventListener('click', () => {
    barrageList.classList.toggle('active')
})

//渲染列表内容函数
function barAddToList(barObjs) {
    //给列表排序
    barObjs.sort((pre, next) => {
        if (pre.location > next.location) {
            return 1
        }
        if (pre.location < next.location) {
            return -1
        }
        return 0
    })
    barObjs.forEach((barObj) => {
        const element = document.createElement('li')
        let M = Math.floor(barObj.location / 60)
        M = (M < 10) ? '0' + M : M
        let S = barObj.location % 60 + 1
        S = (S < 10) ? '0' + S : S
        const location = M + ':' + S
        element.innerHTML =
            `
    <p>${location}</p>
    <p>${barObj.content}</p>
    <p>${barObj.time}</p>`
        document.querySelector('.content .right .barrageList ul').appendChild(element)
    })

}






//评论模块
const commentsList = document.querySelector('.content .left .comments .commentsList')
const writeComment = document.querySelector('.content .left .comments .sendComments #comments')
const sendComment = document.querySelector('.content .left .comments .sendComments button')


sendComment.addEventListener("click", () => {
    addComment(writeComment, commentsList)
})

let n = 0;
//添加评论结点的函数
function addComment(target, father, isReply = false) {
    const content = target.value
    if (!isReply) {
        // 添加评论
        if (content.trim()) {
            const date = new Date()
            const time = date.toLocaleDateString()
            target.value = ''
            const newComment = document.createElement('section')
            newComment.classList.add('comment')
            newComment.innerHTML = `<div class="avata">头像</div>
        <div class="name">name</div>
        <span>${content}
        </span>
        <div class="detailInfo">
        <i class="time">${time}</i>
        <i class="sub">good</i>
        <i class="dis">bad</i>
        <button>回复</button>
        </div>
        <div class="reply">`
            father.appendChild(newComment)
            newComment.index = n
            n += 1
            // 给新添加的评论的回复绑定事件
            newComment.childNodes[6].childNodes[7].addEventListener('click', (e) => {
                //调用添加函数
                reply(newComment.parentNode, newComment.index)
            })
        }
    }

    // 添加回复
    else {
        if (content.trim()) {
            const date = new Date()
            const time = date.toLocaleDateString()
            target.value = ''
            const newComment = document.createElement('section')
            newComment.classList.add('comment')
            newComment.innerHTML = `<div class="avata">头像</div>
        <div class="name">name</div>
        <span>${content}
        </span>
        <div class="detailInfo">
        <i class="time">${time}</i>
        <i class="sub">good</i>
        <i class="dis">bad</i>
        <button>回复</button>
        </div>
        <div class="reply">`
            father.appendChild(newComment)

            // 给新添加的评论的回复绑定事件
            newComment.childNodes[6].childNodes[7].addEventListener('click', (e) => {
                //调用添加函数
                console.log(newComment.parentNode)
                reply(newComment.parentNode.parentNode, newComment.parentNode.parentNode.index, true)
            })
        }
    }

}

//点击回复
isOnReply = false
function reply(target, index, isReply = false) {
    //创建新的回复栏
    if (!isReply) {
        const newReply = document.createElement('div')
        if (!isOnReply) {
            newReply.classList.add('sendReply')
            newReply.innerHTML = `                
    <div class="avata">头像</div>
    <input type="text" id="comments" placeholder="勇敢滴少年快去创造热评~">
    <button class="commentSend">发布</button>
    `
            target.children[index].appendChild(newReply)
            isOnReply = true
            const btn = newReply.childNodes[5]
            btn.addEventListener('click', () => {
                //n是第几个评论的意思，是对应评论的id，值唯一
                addComment(newReply.childNodes[3], target.children[index].children[4], true)
                target.children[index].removeChild(newReply)
                isOnReply = false
            })
        }
    }
    else {
        const newReply = document.createElement('div')
        if (!isOnReply) {
            newReply.classList.add('sendReply')
            newReply.innerHTML = `                
<div class="avata">头像</div>
<input type="text" id="comments" placeholder="勇敢滴少年快去创造热评~">
<button class="commentSend">发布</button>
`
            target.appendChild(newReply)
            isOnReply = true
            const btn = newReply.childNodes[5]
            btn.addEventListener('click', () => {
                //n是第几个评论的意思，是对应评论的id，值唯一
                addComment(newReply.childNodes[3], target.children[4], true)
                target.removeChild(newReply)
                isOnReply = false
            })
        }
    }

}


// 绑定视频控件
const control = document.querySelector('.content .left .video .control')
const videoObj = new Object()
videoObj.body = document.querySelector('.content .left .video')
videoObj.src = document.querySelector('.content .left .video video')
videoObj.previous = document.querySelector('#pre')
videoObj.next = document.querySelector('#next')
videoObj.playAndPuase = document.querySelector('#playAndPause')//这个不用绑定点击，而是改变图标
videoObj.timer = document.querySelector('#timer')
videoObj.progressBar = document.querySelector('#progressBar')
videoObj.clarity = document.querySelector('#clarity')
videoObj.speed = document.querySelector('#speed')
videoObj.volume = document.querySelector('#volume')
videoObj.setting = document.querySelector('#setting')
videoObj.smallWin = document.querySelector('#smallWin')
videoObj.caption = document.querySelector('#caption')
videoObj.pageFull = document.querySelector('#pageFull')
videoObj.full = document.querySelector('#full')


// 播放暂停
function pOp(src, force = false, isToPasue = true) {//false表示要主动控制而不是通过检测视频状态
    if (force) {
        if (isToPasue) {
            src.pause()
            barPause(true)
        }
        else {
            src.play()
            barPause(false)
        }
    }
    else {
        if (src.paused) {
            src.play()
            barPause(false)
        }
        else if (!src.paused) {
            src.pause()
            barPause(true)
        }
    }

}

videoObj.body.addEventListener('click', () => {
    pOp(videoObj.src)
})

// 节流+防抖+鼠标不动隐藏控件


function moveDebounce(fn, t) {
    let timer
    return function () {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn()
        }, t);
    }
}

//模拟hover效果

control.addEventListener('mouseenter', () => {
    control.style.opacity = '1'
})

control.addEventListener('mousemove', () => {
    control.style.opacity = '1'
})

videoObj.body.addEventListener('mouseleave', () => {
    control.style.opacity = '0'
})

videoObj.body.addEventListener('mousemove',
    moveDebounce(() => {
        control.style.opacity = '0'
    }, 2000)
)


videoObj.isFull = false
videoObj.full.addEventListener('click', () => {
    if (!videoObj.isFull) {
        videoObj.body.webkitRequestFullscreen()
        pOp(videoObj.src)
        videoObj.isFull = true
    }
    else {
        document.webkitExitFullscreen()
        pOp(videoObj.src)
        videoObj.isFull = false
    }

})


// 实现普通弹幕功能
// 定义储存弹幕信息的对象
const runningBarrage = document.querySelector('.content .left .video .runningBarrage')
function BarrageInfo(location, time, content)//在视频中的定位的时间，time是现实时间，content就是内容
{
    this.location = location
    this.time = time
    this.content = content
}


barrage = (JSON.parse(localStorage.getItem(`${response.videos[i].title}`))) ? JSON.parse(localStorage.getItem(`${response.videos[i].title}`)) : new Array
console.log(response.videos[i].title)


// 写入弹幕的函数
const barrageInput = document.querySelector('.content .left .sendBarrage #barrage')
const sendBarrage = document.querySelector('.content .left .sendBarrage #barrageSend')

barrageInput.addEventListener('focus', () => {
    pOp(videoObj.src, true, true)
})
sendBarrage.addEventListener('click', () => {
    pOp(videoObj.src, true, false)
})

sendBarrage.addEventListener('click', () => {
    const content = barrageInput.value
    if (content) {
        barrageInput.value = ''
        const location = parseInt(videoObj.src.currentTime)
        //获取日期，补零
        const date = new Date()
        let M = date.getMonth() + 1
        let d = date.getDate()
        let h = date.getHours()
        let m = date.getMinutes()
        M = M < 10 ? '0' + M : M
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        const time = `${M}-${d} ${h}:${m}`
        //创建并写入弹幕对象中
        barrage.push(new BarrageInfo(location, time, content))
        localStorage.setItem(`${response.videos[i].title}`, JSON.stringify(barrage))
        setTimeout(() => {
            creatBarrage(content, true)
        }, 500);
    }
})

//视频作为父盒子的交叉观察对象
const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) {
        runningBarrage.removeChild(entries[0].target)
        observer.unobserve(entries[0].target)
    }
}, {
    root: videoObj.control,
})


//将弹幕发送的函数
function creatBarrage(content, special = false) {
    const bar = document.createElement('p')
    if (special) {
        bar.classList.add('special')//当前发的弹幕会有效果
    }
    bar.innerText = content
    runningBarrage.appendChild(bar)
    const setTime = Math.floor(Math.random() * 3 + 16) + 's'
    bar.style.animationDuration = setTime
    bar.style.animationPlayState = 'running'
    bar.style.top = (Math.random() * 16) + 'rem'
    setTimeout(() => {
        observer.observe(bar)
    }, 100);
    //何时删掉这个弹幕？
}

//拿出弹幕并准备发送的函数
(function (barObj) {
    barAddToList(barObj)
    setInterval(() => {
        if (!videoObj.src.paused) {
            const _bar = barObj.filter((target) => {
                return target.location + 1 === Math.floor(videoObj.src.currentTime)
            }).forEach(element => {
                creatBarrage(element.content)
            })
        }

    }, 1000);

})(JSON.parse(localStorage.getItem(`${response.videos[i].title}`)));//立刻执行函数

//暂停弹幕的函数
function barPause(isToPasue = true) {
    const bar = document.querySelectorAll('.content .left .video .runningBarrage p')
    bar.forEach(
        (element) => {
            if (isToPasue) element.style.animationPlayState = 'paused'
            else { element.style.animationPlayState = 'running' }
        }
    )
}




