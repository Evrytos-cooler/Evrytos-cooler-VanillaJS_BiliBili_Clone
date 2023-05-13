window.onload = function () {
    login = JSON.parse(localStorage.getItem('login'))
    if (login) {
        //登录状态
    }
    else {
        //未登录状态
        document.querySelector('header .headNav .rightNav li  .avata').classList.add('logout')
        document.querySelector('header .headNav .rightNav li  .hidden button').classList.add('logout')
        document.querySelector('header .headNav .rightNav li  .hidden button').innerHTML = `登录`
        document.querySelector('.content .left .sendBarrage .barInput #barrage').classList.add('logout')
        document.querySelector('.content .left .sendBarrage .barInput #barrageSend').classList.add('logout')
        document.querySelector('.content .left .sendBarrage .barInput ').classList.add('logout')
        document.querySelector('.content .left .sendBarrage .barInput #barrage').nextElementSibling.classList.add('logout')
        document.querySelector('.content .left .sendBarrage .barInput #barrage').disabled = true
        document.querySelector('.content .left .comments .sendComments').classList.add('logout')
        document.querySelector('.content .left .comments .sendComments input').disabled = true
        // 登录/注册按钮绑定
        document.querySelectorAll('.content .left .sendBarrage .barInput .hidden i').forEach(e => {
            e.addEventListener('click', () => {
                location.reload()
            })
        })

        document.querySelector('.content .left .comments .sendComments .hidden button').addEventListener('click', () => {
            location.reload()

        })
    }
}
//获取视频参数
const urlParams = new URLSearchParams(window.location.search);
const response = JSON.parse(urlParams.get('src'));
let i = +urlParams.get('current')

//获取元素
const title = document.querySelector('.content .left .title')
const info = document.querySelector('.content .left .info')
const video = document.querySelector('.content .left video')
const favoriteBtn = document.querySelector('.content .left .subcribe .subLeft .favorite')

//渲染视频函数 顺便实现按钮状态的判断，
function refreshVideo(n) {
    title.innerText = response.videos[i].title
    video.setAttribute('src', response.videos[n].videoSrc)
    favoriteBtn.classList.remove('done')
    if (JSON.parse(localStorage.getItem(`${localStorage.getItem('loginUser')}Info`))) {
        JSON.parse(localStorage.getItem(`${localStorage.getItem('loginUser')}Info`)).find((target) => {
            if (target.uuid === response.videos[i].uuid) {
                favoriteBtn.classList.add('done')
            }
        })
    }
}
refreshVideo(i)

const watermark = document.querySelector('.content .left .video .watermark')
function refreshWatermark(n) {
    const video = document.querySelector('.content .left video')
    video.addEventListener('loadedmetadata', () => {
        if (video.videoWidth > 0 && video.videoWidth < 1000) {
            watermark.classList.add('short')
        }
        else {
            watermark.classList.remove('short')
        }
        watermark.querySelector('.up').innerText = response.videos[n].author
    })

}
refreshWatermark(i)

// 渲染up主模块,顺便渲染视频里面加关注的头像和水印
const insideAvata = document.querySelector('.content .left .video .control #follow .avata')
const upAvata = document.querySelector('.content .right .upInfo .infoLeft .avata')
const upName = document.querySelector('.content .right .upInfo .infoRight .name')
const upDescription = document.querySelector('.content .right .upInfo .infoRight .description')

function upInfo(n) {
    upAvata.style.backgroundImage = `url(${response.videos[n].authorAvatarSrc})`
    insideAvata.style.backgroundImage = `url(${response.videos[n].authorAvatarSrc})`
    upName.innerText = response.videos[n].author
}
upInfo(i)



// 弹幕列表
const listHead = document.querySelector('.content .right .barrageList .listHead')
const barrageList = document.querySelector('.content .right .barrageList')
const barrageListContent = document.querySelector('.content .right .barrageList ul')
const _barBox = document.querySelector('.content .left .sendBarrage')
listHead.addEventListener('click', () => {
    barrageList.classList.toggle('active')
    if (barrageList.classList.contains('active')) {
        barrageList.style.height = control.clientHeight + _barBox.clientHeight + 'px';
        barrageList.querySelector('ul').style.height = control.clientHeight + _barBox.clientHeight - 100 + 'px';
    }
    else {
        barrageList.style.height = '50px'
    }
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
const playIcon = document.querySelector('.content .left .video .play')
const control = document.querySelector('.content .left .video .control')
const popBtn = document.querySelector('.content .left .video .control #worktable .left #playAndPause')
const videoObj = new Object()
videoObj.body = document.querySelector('.content .left .video')
videoObj.src = document.querySelector('.content .left .video video')
videoObj.previous = document.querySelector('#pre')
videoObj.next = document.querySelector('#next')
videoObj.playAndPuase = document.querySelector('#playAndPause')//这个不用绑定点击，而是改变图标
videoObj.timer = document.querySelector('#timer')
videoObj.progressBar = document.querySelector('#progressBar')
videoObj.progressBar1 = document.querySelector('.progressBar1')
videoObj.barChild = videoObj.progressBar.firstElementChild
videoObj.barChild1 = videoObj.progressBar1.firstElementChild
videoObj.clarity = document.querySelector('#clarity')
videoObj.speed = document.querySelector('#speed')
videoObj.volume = document.querySelector('#volume')
videoObj.setting = document.querySelector('#setting')
videoObj.smallWin = document.querySelector('#smallWin')
videoObj.caption = document.querySelector('#caption')
videoObj.pageFull = document.querySelector('#pageFull')
videoObj.full = document.querySelector('#full')


// 播放暂停
function pOp(src, force = false, isToPasue = true) {
    //false表示要主动控制而不是通过检测视频状态
    if (force) {
        if (isToPasue) {
            src.pause()
            playIcon.style.opacity = '1'
            popBtn.querySelector('.onPlay').style.display = 'none'
            popBtn.querySelector('.onPause').style.display = 'block'

            barPause(true)
        }
        else {
            src.play()
            playIcon.style.opacity = '0'
            popBtn.querySelector('.onPlay').style.display = 'block'
            popBtn.querySelector('.onPause').style.display = 'none'
            barPause(false)
        }
    }
    else {
        if (src.paused) {
            src.play()
            playIcon.style.opacity = '0'
            popBtn.querySelector('.onPlay').style.display = 'block'
            popBtn.querySelector('.onPause').style.display = 'none'
            barPause(false)
        }
        else if (!src.paused) {
            src.pause()
            playIcon.style.opacity = '1'
            popBtn.querySelector('.onPlay').style.display = 'none'
            popBtn.querySelector('.onPause').style.display = 'block'
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
barrageInput.addEventListener('blur', () => {
    pOp(videoObj.src, false)
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
    let S = Math.floor(time) % 60 + 1
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
    barBtn.querySelector('.barOn').classList.toggle("active")
    barBtn.querySelector('.barOff').classList.toggle("active")
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
    refreshVideo(i)
    upInfo(i)
    refreshWatermark(i)
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
    refreshVideo(i)
    upInfo(i)
    refreshWatermark(i)
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
    refreshVideo(i)
    upInfo(i)
    refreshWatermark(i)
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

//可点击进度条实现
videoObj.progressBar.addEventListener('click', (mouse) => {
    const deltaX = mouse.clientX - videoObj.barChild.getBoundingClientRect().left
    const length = videoObj.progressBar.offsetWidth
    videoObj.src.currentTime = deltaX / length * videoObj.src.duration
    refreshProcessingBar()
})
//可拖动进度条实现
let isMouseDownInPB = false

videoObj.progressBar.addEventListener('mousedown', () => {
    isMouseDownInPB = true
})

window.addEventListener('mouseup', () => {
    if (isMouseDownInPB) {
        pOp(videoObj.src)
        isMouseDownInPB = false
    }
})

window.addEventListener('mousemove', (mouse) => {
    if (isMouseDownInPB) {
        const deltaX = mouse.clientX - videoObj.barChild.getBoundingClientRect().left
        const length = videoObj.progressBar.offsetWidth
        videoObj.src.currentTime = deltaX / length * videoObj.src.duration
        refreshProcessingBar()
    }

})

//视频播放完之后连播//或者结束
videoObj.src.addEventListener('ended', () => {
    if (isAutoContinue) {
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
        refreshVideo(i)
        upInfo(i)
        refreshWatermark(i)
        refreshVideoList(i)
        barClear()
        barSending(i)
        refreshComments(i)
    }

})




const commentsList = document.querySelector('.content .left .comments .commentsList')
const writeComment = document.querySelector('.content .left .comments .sendComments #comments')
const sendComment = document.querySelector('.content .left .comments .sendComments button')
const commentAvata = document.querySelector('.content .left .comments .sendComments .avata');

(async () => {
    const mainAvata = await getAvata(localStorage.getItem("loginUser"))
    commentAvata.style = `background-image: url(${mainAvata})`
})();


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
async function addComment(target, father, isReply = false, btn) {
    let content = target.value
    const uname = localStorage.getItem('loginUser')
    const avataUrl = await getAvata(uname)

    if (!isReply) {
        // 添加评论
        if (content.trim()) {
            const date = new Date()
            const time = date.toLocaleString().replace(/\//g, '-')
            target.value = ''
            const newComment = document.createElement('section')
            newComment.classList.add('comment')
            newComment.innerHTML = `<div class="avata" style='background-image: url(${avataUrl})'></div>
        <div class="name">${uname}</div>
        <span>${content}
        </span>
        <div class="detailInfo">
        <i class="time">${time}</i>
        <i class="sub iconfont">&#xec7f;</i>
        <i class="dis iconfont">&#xe603;</i>
        <button>回复</button>
        <button>删除</button>
        </div>
        <div class="reply">`
            father.appendChild(newComment)
            // 给新添加的评论的回复绑定事件
            newComment.childNodes[6].childNodes[7].addEventListener('click', (e) => {
                //调用添加函数
                replying(newComment, false, e.target)
            })
            //绑定删除事件

            newComment.children[3].children[4].addEventListener('click', (e) => {
                //调用添加函数
                deleteComment(e.target)
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
            commentSave.avata = avataUrl
            commentSave.uname = uname
            commentSave.time = time
            commentSave.content = content
            list.push(commentSave)//添加到列表里
            localStorage.setItem(response.videos[i].title + ' comments', JSON.stringify(list))

        }
    }

    // 添加回复
    else {
        if (content.trim()) {
            if (btn.parentNode.parentNode.querySelector(".name").innerText != father.parentNode.querySelector(".name").innerText) {
                content = '@' + btn.parentNode.parentNode.querySelector('.name').innerText + ' ' + content
            }

            const date = new Date()
            const time = date.toLocaleString().replace(/\//g, '-')
            target.value = ''
            const newComment = document.createElement('section')
            newComment.classList.add('comment')
            newComment.innerHTML = `<div class="avata" style='background-image: url(${avataUrl})'></div>
        <div class="name">${uname}</div>
        <span>${content}
        </span>
        <div class="detailInfo">
        <i class="time">${time}</i>
        <i class="sub iconfont">&#xec7f;</i>
        <i class="dis iconfont">&#xe603;</i>
        <button>回复</button>
        <button>删除</button>
        </div>
        <div class="reply">`
            father.appendChild(newComment)

            // 给新添加的评论的回复绑定事件
            newComment.childNodes[6].childNodes[7].addEventListener('click', (e) => {
                //调用添加函数
                replying(newComment.parentNode, true, e.target)
            })

            //添加删除函数
            newComment.children[3].children[4].addEventListener('click', (e) => {
                //调用添加函数
                deleteComment(e.target)
            })

            //保存评论
            list = JSON.parse(localStorage.getItem(response.videos[i].title + ' comments'))
            commentSave = new commentInfo()
            commentSave.avata = avataUrl
            commentSave.uname = uname
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
let isOnReply = false
async function replying(target, isReply = false, fatherBtn) {
    //创建新的回复栏
    const avataUrl = await getAvata(localStorage.getItem('loginUser'))
    if (!isReply) {
        const newReply = document.createElement('div')
        if (!isOnReply) {
            newReply.classList.add('sendReply')
            newReply.innerHTML = `                
    <div class="avata" style='background-image: url(${avataUrl})'></div>
    <input type="text" id="comments" placeholder="勇敢滴少年快去创造热评~">
    <button class="commentSend">发布</button>
    `
            target.appendChild(newReply)
            isOnReply = true
            const btn = newReply.childNodes[5]
            btn.addEventListener('click', () => {
                addComment(newReply.childNodes[3], target.children[4], true, fatherBtn)
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
<div class="avata" style='background-image: url(${avataUrl})'></div>
<input type="text" id="comments" placeholder="勇敢滴少年快去创造热评~">
<button class="commentSend">发布</button>
`
            target.parentNode.appendChild(newReply)
            isOnReply = true
            const btn = newReply.childNodes[5]
            btn.addEventListener('click', () => {
                addComment(newReply.childNodes[3], target.parentNode.children[4], true, fatherBtn)
                target.parentNode.removeChild(newReply)
                isOnReply = false
            })
        }
    }

}

//显示（刷新0）评论的函数
async function refreshComments(i) {
    const father = document.querySelector('.commentsList')
    //初始化一下
    father.innerHTML = ''
    if (JSON.parse(localStorage.getItem(response.videos[i].title + ' comments'))) {

        const commentObj = JSON.parse(localStorage.getItem(response.videos[i].title + ' comments'))
        commentObj.forEach(async comment => {
            //获取每个评论的头像，在comment 这个local对象中是有bolb url的,也可以直接从服务器取下来
            let avataUrl = await getAvata(comment.uname)
            const newComment = document.createElement('section')
            newComment.classList.add('comment')

            //其中的content包括了@谁
            newComment.innerHTML = `<div class="avata" style='background-image: url(${avataUrl})'></div>
        <div class="name">${comment.uname}</div>
        <span>${comment.content} 
        </span>
        <div class="detailInfo">
        <i class="time">${comment.time}</i>
        <i class="sub iconfont">&#xec7f;</i>
        <i class="dis iconfont">&#xe603;</i>
        <button>回复</button>
        </div>
        <div class="reply">`
            father.appendChild(newComment)

            //对里面的reply迭代
            comment.reply.forEach(async reply => {
                const _newComment = document.createElement('section')
                const avataUrl = await getAvata(reply.uname)
                _newComment.classList.add('comment')
                _newComment.innerHTML = `<div class="avata" style='background-image: url(${avataUrl})'></div>
                <div class="name">${reply.uname}</div>
                <span>${reply.content}
                </span>
                <div class="detailInfo">
                <i class="time">${reply.time}</i>
                <i class="sub iconfont">&#xec7f;</i>
        <i class="dis iconfont">&#xe603;</i>
                <button>回复</button>
                </div>
                <div class="reply">`

                newComment.appendChild(_newComment)
                _newComment.childNodes[6].childNodes[7].addEventListener('click', (e) => {
                    //调用添加函数
                    replying(_newComment, true, e.target)
                })

                if (reply.uname === localStorage.getItem('loginUser')) {
                    const del = document.createElement('button')
                    del.innerText = "删除"
                    _newComment.querySelector('.detailInfo').appendChild(del)
                    del.addEventListener('click', (e) => {
                        //调用添加函数
                        deleteComment(e.target)
                    })
                }

            })

            //绑定按键
            newComment.childNodes[6].childNodes[7].addEventListener('click', (e) => {
                //调用添加函数
                replying(newComment, false, e.target)
            })

            // 如果当前登录的是发送评论的本人，那么就可以删除
            if (comment.uname === localStorage.getItem('loginUser')) {
                const del = document.createElement('button')
                del.innerText = "删除"
                newComment.querySelector('.detailInfo').appendChild(del)
                del.addEventListener('click', (e) => {
                    //调用添加函数
                    deleteComment(e.target)
                })
            }

        })
    }
}

refreshComments(i)

// 获取头像的函数，（用户名，）
async function getAvata(uname) {
    //发送ajax请求
    const response = await fetch(`https://frontend.exam.aliyun.topviewclub.cn/api/getAvatar?username=${uname}`, {
        method: 'POST',
    })
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    return url
}

//优化，当视频不可见的时候自动暂停
const videoObserver = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.intersectionRatio < 0.7) {
        pOp(videoObj.src, true, true)
    }
    else {
        pOp(videoObj.src, true, false)
    }
}, {
    threshold: 0.7
})
videoObserver.observe(control)

// 收藏模块
const subcribeBtn = document.querySelector('.content .left .subcribe .subLeft .subcribe')
const coinsBtn = document.querySelector('.content .left .subcribe .subLeft .coins')
const shareBtn = document.querySelector('.content .left .subcribe .subLeft .share')
// 点赞，有长按功能
let isLong = false
let animationTimer = null
subcribeBtn.addEventListener('mousedown', () => {
    if (!(favoriteBtn.classList.contains('done') && subcribeBtn.classList.contains('done') && coinsBtn.classList.contains('done'))) {
        mousedown_start_time = new Date().getTime()
        animationTimer = setTimeout(() => {
            subcribeBtn.classList.add('loading')
            coinsBtn.classList.add('loading')
            favoriteBtn.classList.add('loading')
            favoriteBtn.addEventListener('animationend', () => {
                subcribeBtn.classList.add('boom')
                coinsBtn.classList.add('boom')
                favoriteBtn.classList.add('boom')
                favoriteBtn.addEventListener('animationend', () => {
                    subcribeBtn.classList.remove('boom')
                    coinsBtn.classList.remove('boom')
                    favoriteBtn.classList.remove('boom')
                    if (!subcribeBtn.classList.contains('done')) {
                        subcribeBtn.classList.add('done')
                    }
                    if (!coinsBtn.classList.contains('done')) {
                        coinsBtn.click()
                    }
                    if (!favoriteBtn.classList.contains('done')) {
                        favoriteBtn.click()
                    }
                })
            })

        }, 500);
    }

})
subcribeBtn.addEventListener('mouseleave', () => {
    subcribeBtn.classList.remove('loading')
    coinsBtn.classList.remove('loading')
    favoriteBtn.classList.remove('loading')
    clearTimeout(animationTimer)
})
subcribeBtn.addEventListener('mouseup', () => {
    mousedown_end_time = new Date().getTime()
    if (mousedown_end_time - mousedown_start_time < 500) {
        subcribeBtn.classList.toggle('done')
    }
    else {
        subcribeBtn.classList.remove('loading')
        coinsBtn.classList.remove('loading')
        favoriteBtn.classList.remove('loading')
        clearTimeout(animationTimer)
    }

})
// 分享
shareBtn.addEventListener('click', () => {
    shareBtn.classList.toggle('done')
})
// 投币
coinsBtn.addEventListener('click', () => {
    coinsBtn.classList.toggle('done')
})
// 收藏
favoriteBtn.addEventListener('click', (e) => {
    let list = JSON.parse(localStorage.getItem(`${localStorage.getItem('loginUser')}Info`))
    if (list === null) {
        list = new Array()
    }
    //首先拿出了原来的数据

    if (favoriteBtn.classList.contains('done'))//如果已经点击过了
    {
        favoriteBtn.classList.remove('done')
        if (list.length === 1) {
            list = new Array
        } else {
            list = list.splice(list.indexOf(list.find((target) => {
                return target.uuid === response.videos[i].uuid
            })), 1)
        }


    }
    else {    //添加数据
        list.push(response.videos[i])
        //已经收藏
        favoriteBtn.classList.add('done')
    }

    //保存数据
    localStorage.setItem(`${localStorage.getItem('loginUser')}Info`, JSON.stringify(list))
})


function deleteComment(btn) {
    //在dom中删除
    btn.parentNode.parentNode.parentNode.removeChild(btn.parentNode.parentNode)
    //在localstorage中删除
    const commentObj = JSON.parse(localStorage.getItem(response.videos[i].title + ' comments'))
    commentObj.splice(commentObj.indexOf(commentObj.find(comment => {
        const result = (btn.parentNode.parentNode.children[1].innerText === comment.uname) &&
            (btn.parentNode.children[0].innerText === comment.time)
        return result
    })), 1);
    localStorage.setItem(response.videos[i].title + ' comments', JSON.stringify(commentObj))
}



// 自动连播按钮
const autoContinue = document.querySelector('.content .right .videoList .listHead .top input[type="checkbox"]')
const label = document.querySelector('.content .right .videoList .listHead .top label')
let isAutoContinue = true
autoContinue.addEventListener('click', () => {
    if (autoContinue.checked) {
        label.classList.remove('off')
        isAutoContinue = true
        //开启自动连播
    }
    else {
        label.classList.add('off')
        isAutoContinue = false
    }
})


// 调试用
control.style.opacity = 1;


// 音量hover效果：
const volume = document.querySelector('.content .left .video .control .right #volume .iconfont svg')

const volumeHidden = document.querySelector('.content .left .video .control .right #volume .volumeHidden')
const volumeControl = document.querySelector('.content .left .video .control .right #volume .volumeControl')
const volumeCurrent = volumeControl.querySelector('.volumeCurrent')
const volumeBar = volumeControl.querySelector('.volumeBar')
const volumeNumber = volumeControl.querySelector('.number')

volume.addEventListener("mouseenter", () => {
    volumeHidden.style.display = 'block'
})
volumeHidden.addEventListener("mouseleave", () => {
    volumeHidden.style.display = 'none'
})


// 控制音量
volume.addEventListener('click', (e) => {
    pOp(videoObj.src)
    if (volumeNumber.innerText === '0') {
        videoObj.src.volume = 1
        volumeCurrent.style.height = volumeBar.clientHeight + 'px'
        volumeNumber.innerText = 100
    }
    else {
        videoObj.src.volume = 0
        volumeCurrent.style.height = '0px'
        volumeNumber.innerText = 0
    }

})
let isMouseOnvolume = false
volumeControl.addEventListener('click', (e) => {
    pOp(videoObj.src)

    if ((Math.floor(((volumeBar.getBoundingClientRect().bottom - e.clientY) / volumeBar.clientHeight) * 100) / 100) < 0) {
        videoObj.src.volume = 0
        volumeCurrent.style.height = '0px'
        volumeNumber.innerText = 0
    }
    else if ((volumeBar.getBoundingClientRect().bottom - e.clientY) > volumeBar.clientHeight) {
        volumeCurrent.style.height = volumeBar.clientHeight + 'px'
        videoObj.src.volume = 1
        volumeNumber.innerText = 100

    }
    else {
        videoObj.src.volume = (Math.floor(((volumeBar.getBoundingClientRect().bottom - e.clientY) / volumeBar.clientHeight) * 100) / 100)
        volumeCurrent.style.height = (volumeBar.getBoundingClientRect().bottom - e.clientY) + 'px'
        volumeNumber.innerText = Math.floor(((volumeBar.getBoundingClientRect().bottom - e.clientY) / volumeBar.clientHeight) * 100)

    }
})

volumeControl.addEventListener('mousedown', () => {
    isMouseOnvolume = true
})

volumeControl.addEventListener('mousemove', (e) => {
    if (isMouseOnvolume) {
        if ((Math.floor(((volumeBar.getBoundingClientRect().bottom - e.clientY) / volumeBar.clientHeight) * 100) / 100) < 0) {
            videoObj.src.volume = 0
            volumeCurrent.style.height = '0px'
            volumeNumber.innerText = 0
        }
        else if ((volumeBar.getBoundingClientRect().bottom - e.clientY) > volumeBar.clientHeight) {
            volumeCurrent.style.height = volumeBar.clientHeight + 'px'
            videoObj.src.volume = 1
            volumeNumber.innerText = 100

        }
        else {
            videoObj.src.volume = (Math.floor(((volumeBar.getBoundingClientRect().bottom - e.clientY) / volumeBar.clientHeight) * 100) / 100)
            volumeCurrent.style.height = (volumeBar.getBoundingClientRect().bottom - e.clientY) + 'px'
            volumeNumber.innerText = Math.floor(((volumeBar.getBoundingClientRect().bottom - e.clientY) / volumeBar.clientHeight) * 100)

        }
    }
})
volumeControl.addEventListener('mouseup', () => {
    isMouseOnvolume = false
})

// 倍速播放
const speedBtn = document.querySelector('.content .left .video .control #worktable .right #speed')
const speedHidden = speedBtn.querySelector('.speedHidden')
const speedUl = speedBtn.querySelector('.speedHidden ul')
speedBtn.addEventListener("mouseenter", () => {
    speedHidden.style.display = 'block'
})

speedHidden.addEventListener("mouseleave", () => {
    speedHidden.style.display = 'none'
})

speedUl.addEventListener("click", (e) => {
    pOp(videoObj.src)
    Array.from(speedUl.children).forEach(child => {
        if (child.classList.contains('active')) {
            child.classList.remove('active')
            return;
        }
    })
    e.target.classList.add('active')
    videoObj.src.playbackRate = parseFloat(e.target.innerText)
})