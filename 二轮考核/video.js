const urlParams = new URLSearchParams(window.location.search);
const response = JSON.parse(urlParams.get('src'));
let i = +urlParams.get('current')

//获取元素
const title = document.querySelector('.content .left .title')
const info = document.querySelector('.content .left .info')
const video = document.querySelector('.content .left video')

//渲染视频函数

function refreshVideo(n) {
    title.innerText = response.videos[i].title
    video.setAttribute('src', response.videos[n].videoSrc)

}
refreshVideo(i)


// 渲染up主模块
const upAvata = document.querySelector('.content .right .upInfo .infoLeft .avata')
const upName = document.querySelector('.content .right .upInfo .infoRight .name')
const upDescription = document.querySelector('.content .right .upInfo .infoRight .description')

function upInfo(n) {
    upAvata.style.backgroundImage = `url(${response.videos[n].authorAvatarSrc})`
    upName.innerText = response.videos[n].author
}
upInfo(i)



// 弹幕列表
const listHead = document.querySelector('.content .right .barrageList .listHead')
const barrageList = document.querySelector('.content .right .barrageList')
const barrageListContent = document.querySelector('.content .right .barrageList ul')

listHead.addEventListener('click', () => {
    barrageList.classList.toggle('active')
})


//渲染列表内容函数
function barAddToList(barObjs) {

    // 清空列表重新加载，就算没有也要清空
    const barList = document.querySelector('.content .right .barrageList ul')
    let bar = document.querySelectorAll('.content .right .barrageList ul li')
    bar.forEach(
        (entry, index) => {
            if (index != 0) { barList.removeChild(entry) }
        }
    )

    if (barObjs) {
        //给列表排序
        barObjs.sort(function (pre, next) {
            return (pre.location - next.location)
        })


        //渲染新的列表
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
videoObj.progressBar1 = document.querySelector('.progressBar1')
videoObj.clarity = document.querySelector('#clarity')
videoObj.speed = document.querySelector('#speed')
videoObj.volume = document.querySelector('#volume')
videoObj.setting = document.querySelector('#setting')
videoObj.smallWin = document.querySelector('#smallWin')
videoObj.caption = document.querySelector('#caption')
videoObj.pageFull = document.querySelector('#pageFull')
videoObj.full = document.querySelector('#full')
videoObj.barChild = videoObj.progressBar.firstElementChild
videoObj.barChild1 = videoObj.progressBar1.firstElementChild


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
    barrage = (JSON.parse(localStorage.getItem(`${response.videos[i].title}`))) ? JSON.parse(localStorage.getItem(`${response.videos[i].title}`)) : new Array
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
        localStorage.setItem(response.videos[i].title, JSON.stringify(barrage))//存储
        // 写入待发送列表
        barAddToList(JSON.parse(localStorage.getItem(response.videos[i].title)))
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
    bar.style.top = (Math.floor(Math.random() * 16 + 1)) + 'rem'
    setTimeout(() => {
        observer.observe(bar)
    }, 100);
    //何时删掉这个弹幕？
}


//封装格式化时间的函数
function formation(time) {
    let M = Math.floor(time / 60)
    M = (M < 10) ? '0' + M : M
    let S = Math.floor(time) + 1
    S = (S < 10) ? '0' + S : S
    const formationTime = M + ':' + S
    return formationTime
}

//拿出弹幕并准备发送的函数
//顺便改视频时间
let interval = null;
function barSending(n) {
    if (interval) { clearInterval(interval) }
    let barObj = JSON.parse(localStorage.getItem(`${response.videos[n].title}`))
    barAddToList(barObj)
    interval = setInterval(() => {//全局变量

        //更改视频播放时间和进度条
        videoObj.timer.innerText = `
    ${formation(videoObj.src.currentTime)}/${formation(videoObj.src.duration)}`
        refreshProcessingBar()
        if (!videoObj.src.paused) {
            if (barObj) {
                const _bar = barObj.filter((target) => {
                    return target.location + 1 === Math.floor(videoObj.src.currentTime)
                }).forEach(element => {
                    creatBarrage(element.content)
                })
            }

        }

    }, 1000);
}

barSending(i)

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


//开启和关闭弹幕
const barBtn = document.querySelector('.content .left .sendBarrage #barrageToggle')
barBtn.addEventListener('click', (e) => {
    runningBarrage.classList.toggle('close')
})

//视频列表
function refreshVideoList(n) {
    const videoList = document.querySelector('.content .right .videoList ul')
    //先清空再创建
    let li = document.querySelectorAll('.content .right .videoList ul li')
    li.forEach(
        (entry) => {
            videoList.removeChild(entry)
        }
    )
    response.videos.forEach((video) => {
        const li = document.createElement('li')
        if (video.title === response.videos[n].title) {
            li.classList.add('playingVideo')
        }
        li.classList.add('listedVideo')
        li.innerText = `${video.title}`
        videoList.appendChild(li)
    })
}

refreshVideoList(i)

//清空当前弹幕
function barClear() {
    let barLi = document.querySelector('.runningBarrage')
    let bar = document.querySelectorAll('.runningBarrage p')
    bar.forEach(
        (entry) => {
            barLi.removeChild(entry)
        }
    )
}


//上一个，下一个视频
videoObj.previous.addEventListener('click', () => {

    if (i === 0) {
        pOp(videoObj.src)
        return;
        // i = response.videos.length - 1
        // 已经没有视频了，这里要改变颜色按键
    }
    else {
        i--
        if (i === 0) {
            //改变按键颜色
        }
    }
    upInfo(i)
    refreshVideo(i)
    refreshVideoList(i)
    barClear()
    barSending(i)
    refreshComments(i)

})

videoObj.next.addEventListener('click', () => {
    if (i === response.videos.length - 1) {
        pOp(videoObj.src)
        return;
    }
    else {
        i++
        if (i === response.videos.length - 1) {
            //改变按键颜色
        }
    }
    upInfo(i)
    refreshVideo(i)
    refreshVideoList(i)
    barClear()
    barSending(i)
    refreshComments(i)
})

//视频播放的时间

videoObj.timer.addEventListener('click', () => {
    pOp(videoObj.src)
})//处理冲突



// 点击切换视频
//把title拿出来对应i
let titleToIndex = new Array()
response.videos.forEach((video, index) => {
    titleToIndex.push(video.title)
})

//事件委托
const videoList = document.querySelector('.content .right .videoList ul')
videoList.addEventListener('click', (e) => {
    i = titleToIndex.indexOf(e.target.innerText)
    upInfo(i)
    refreshVideo(i)
    refreshVideoList(i)
    barClear()
    barSending(i)
    refreshComments(i)
})

//进度获取进度条
function refreshProcessingBar() {
    videoObj.barChild.style.width = (videoObj.src.currentTime / videoObj.src.duration) * 100 + '%'
    videoObj.barChild1.style.width = (videoObj.src.currentTime / videoObj.src.duration) * 100 + '%'
}


//视频播放完之后连播
videoObj.src.addEventListener('ended', () => {
    if (i === response.videos.length - 1) {
        //这里显示播放完成的界面
        return;
    }
    else {
        i++
        if (i === response.videos.length - 1) {
            //改变按键颜色
        }
    }
    upInfo(i)
    refreshVideo(i)
    refreshVideoList(i)
    barClear()
    barSending(i)
    refreshComments(i)
})




//评论模块 需要进行重构，有问题，还挺大
const commentsList = document.querySelector('.content .left .comments .commentsList')
const writeComment = document.querySelector('.content .left .comments .sendComments #comments')
const sendComment = document.querySelector('.content .left .comments .sendComments button')

//保存评论的JSON对象
function commentInfo(avata, uname, time, content, reply) {
    this.avata = avata
    this.uname = uname
    this.time = time
    this.content = content
    this.reply = []
}

sendComment.addEventListener("click", () => {
    addComment(writeComment, commentsList)
})

//添加评论结点的函数
function addComment(target, father, isReply = false) {
    const content = target.value
    if (!isReply) {
        // 添加评论
        if (content.trim()) {
            const date = new Date()
            const time = date.toLocaleString()
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
                replying(newComment)

            })


            // 保存评论
            //如果真的产生了评论，那么就保存,这里是评论不是回复
            if (!localStorage.getItem(response.videos[i].title + ' comments'))//第一次创建评论 ,要产生新的对象放进去，如果不是第一次就可以直接拿出来用
            {
                list = new Array()
            }
            else {
                list = JSON.parse(localStorage.getItem(response.videos[i].title + ' comments'))
            }
            commentSave = new commentInfo()
            commentSave.avata = '头像地址'
            commentSave.uname = '获取名字'
            commentSave.time = time
            commentSave.content = content
            list.push(commentSave)//添加到列表里
            localStorage.setItem(response.videos[i].title + ' comments', JSON.stringify(list))

        }
    }

    // 添加回复
    else {
        if (content.trim()) {
            const date = new Date()
            const time = date.toLocaleString()
            target.value = ''
            const newComment = document.createElement('section')
            newComment.classList.add('comment')
            newComment.innerHTML = `<div class="avata">头像</div>
        <div class="name">name</div>
        <span>@name${content}
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
                replying(newComment.parentNode, true)
            })

            //保存评论
            list = JSON.parse(localStorage.getItem(response.videos[i].title + ' comments'))
            commentSave = new commentInfo()
            commentSave.avata = '头像地址'
            commentSave.uname = '获取名字'
            commentSave.time = time
            commentSave.content = content
            list.forEach((target) => {
                if (target.time === father.parentNode.querySelector('.detailInfo').querySelector('.time').innerText) {
                    target.reply.push(commentSave)//这里的判断条件要修改严谨一点
                }
            })//这里要吧这个评论保存到对应的数组下面,问题是如何找到父元素的在localStroage里面的位置。
            //利用同一个时间，同一个人只能发同一个评论来区分（名字和时间都对的上）
            localStorage.setItem(response.videos[i].title + ' comments', JSON.stringify(list))
        }
    }

}

//点击回复，创建新的回复栏
isOnReply = false
function replying(target, isReply = false) {
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
    else {
        const newReply = document.createElement('div')
        if (!isOnReply) {
            newReply.classList.add('sendReply')
            newReply.innerHTML = `                
<div class="avata">头像</div>
<input type="text" id="comments" placeholder="勇敢滴少年快去创造热评~">
<button class="commentSend">发布</button>
`
            target.parentNode.appendChild(newReply)
            isOnReply = true
            const btn = newReply.childNodes[5]
            btn.addEventListener('click', () => {
                //n是第几个评论的意思，是对应评论的id，值唯一
                addComment(newReply.childNodes[3], target.parentNode.children[4], true)
                target.parentNode.removeChild(newReply)
                isOnReply = false
            })
        }
    }

}

//显示（刷新0）评论的函数
function refreshComments(i) {
    const father = document.querySelector('.commentsList')
    //初始化一下
    father.innerHTML = ''
    if (JSON.parse(localStorage.getItem(response.videos[i].title + ' comments'))) {

        const commentObj = JSON.parse(localStorage.getItem(response.videos[i].title + ' comments'))
        commentObj.forEach(comment => {
            const newComment = document.createElement('section')
            newComment.classList.add('comment')
            newComment.innerHTML = `<div class="avata">头像</div>
        <div class="name">name</div>
        <span>@name${comment.content}
        </span>
        <div class="detailInfo">
        <i class="time">${comment.time}</i>
        <i class="sub">good</i>
        <i class="dis">bad</i>
        <button>回复</button>
        </div>
        <div class="reply">`
            father.appendChild(newComment)

            //对里面的reply迭代
            comment.reply.forEach(reply => {
                const _newComment = document.createElement('section')
                _newComment.classList.add('comment')
                _newComment.innerHTML = `<div class="avata">头像</div>
                <div class="name">name</div>
                <span>@name${reply.content}
                </span>
                <div class="detailInfo">
                <i class="time">${reply.time}</i>
                <i class="sub">good</i>
                <i class="dis">bad</i>
                <button>回复</button>
                </div>
                <div class="reply">`

                newComment.appendChild(_newComment)
                _newComment.childNodes[6].childNodes[7].addEventListener('click', (e) => {
                    //调用添加函数
                    replying(_newComment, true)
                })

            })

            //绑定按键
            newComment.childNodes[6].childNodes[7].addEventListener('click', (e) => {
                //调用添加函数
                replying(newComment)
            })
        })
    }
}

refreshComments(i)