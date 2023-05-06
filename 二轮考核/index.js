//头部导航栏行为
const headNav = document.querySelector('header .headNav')
const leftNav = headNav.querySelector('.leftNav')
//这里要节流但是有点问题
let active = true
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        headNav.classList.add('fixed')
        leftNav.querySelector('li').style.display = 'block'
    }
    else {
        headNav.classList.remove('fixed')
        leftNav.querySelector('li').style.display = 'none'
    }
})
//实现无限加载
//节流
let timer = null
function throttle(fn, t) {
    return function () {
        if (!timer) {//如果此时没有计时器，就打开，如果有计时器，那就是在里面等待，再次执行
            timer = setTimeout(function () {
                fn()
                timer = null //执行完就关掉定时器
            }, t)
        }
    }
}

//滚动产生新的盒子
window.addEventListener("scroll", throttle(async () => {
    //回调函数
    //如果页面划到了距离最下面有一定距离的地方，就渲染新的数据
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop//文档的滚动高度
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight//文档的总高度
    const clientHeight = document.documentElement.clientHeight || window.innerHeight//当前视窗的高度
    //逻辑或是为了兼容性
    if (scrollTop + clientHeight >= scrollHeight - 100) {//视窗高度加滚动高度接近总高度了
        //渲染新的html
        await addVideo()
        //请求视频
        const sections = document.querySelectorAll('.content .loading')
        askForVideo(sections)
    }
}, 500));


//但这个函数必须滚动起来才能触发，如果没有滚动,屏幕比较长，但是视频也没有加载好，就有问题
//于是打开页面先判断够不够长，不够长就继续渲染
function checking() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    const clientHeight = document.documentElement.clientHeight || window.innerHeight
    if (scrollHeight <= clientHeight) {
        addVideo()//添加html
        const sections = document.querySelectorAll('.content .loading')
        askForVideo(sections)//请求视频
        return checking()
    }
    else return
}
checking()

window.addEventListener('resize', checking)

//添加新的视频盒子
function addVideo() {
    for (let i = 0; i < 15; i++) {
        const box = document.querySelector('.content')
        const section = document.createElement('section')
        section.classList.add('loading')
        section.innerHTML =
            `<div></div>
            <span id="a"></span>
            <span id="b"></span>
            <span id="c"></span>`
        box.appendChild(section)
    }
}

//ajax放在外面会不会好一点？
// 懒加载ajax 用intersection observer
async function askForVideo(sections) {//参数是要请求加载的视频列表
    let observer = new IntersectionObserver(async (entries) => {
        //先发送ajax请求然后再forEach渲染
        await fetch('https://frontend.exam.aliyun.topviewclub.cn/api/getHomePageVideo',
            {
                method: "GET"
            }
        ).then(response => {
            if (response.status >= 200 && response.status <= 300) {
                if (response.ok = true) {
                    return response.json()
                }
            }
        }).then(response => {
            //得到数据了可以渲染了
            let i = 0
            entries.forEach(entry => {
                const src = response.videos[i].videoSrc
                const title = response.videos[i].title
                const author = response.videos[i].author
                const describe = response.videos[i].describe
                const uuid = response.videos[i].uuid
                const authorAvatarSrc = response.videos[i].authorAvatarSrc
                entry.target.innerHTML =
                    `<div class='video' muted="true"><video src="${src}"></video>
                    <div class='runningBarrage'></div>
                    <div class='laterView iconfont'>&#xe8a3;</div>
                    <div class='videoCard'>
                     <p><i class='iconfont'>&#xe70a;</i>2</p>
                     <p><i class='iconfont'>&#xe665;</i>2</p>
                     <p>时长</p>
                    </div>
                    </div>
                <p class="videoTitle">${title}</p>
                <p class="author"><i class='iconfont'>&#xe666;</i>${author}</p>`
                entry.target.classList.remove('loading')
                entry.target.classList.add('ready')
                observer.unobserve(entry.target)
                replaceUrl(entry.target.firstElementChild, 'video.html?' + "src=" + `${JSON.stringify(response)}` + '&current=' + `${i}`)
                mouseenterPlay(entry.target.firstElementChild.firstElementChild)
                // 显示视频的时间
                entry.target.querySelector('.video').querySelector("video").addEventListener('loadedmetadata', (e) => {
                    entry.target.querySelector('.video .videoCard p:nth-of-type(3)').innerText = formation(e.target.duration)
                })
                i = (i === 9) ? 0 : i + 1
                // 加载完之后把类名改ready，并取消观察,添加点击跳转事件,添加悬停播放事件
            })
        })
    }, { threshold: 1 })
    //创建交叉观察对象

    //观察放视频的section
    sections.forEach((section) => {
        observer.observe(section)
    })
}

//给每个视频绑定点击跳转事件
function replaceUrl(target, url) {
    target.addEventListener('click', () => {
        window.open(url)
    })
}
//鼠标悬停播放视频，弹幕
function mouseenterPlay(target) {//target是个media标签
    target.addEventListener('mouseenter', () => {
        target.muted = true
        target.play()
        barSending(target)
        runningBarrage.style.display = 'block'
    })
    target.addEventListener('mouseleave', () => {
        target.pause()
        runningBarrage.style.display = 'none'

    })
}


//悬停播放弹幕定义函数
//选出弹幕的函数
function barSending(target) {//传进来的target是media
    runningBarrage = target.parentNode.parentNode.querySelector('.runningBarrage') //全局变量，每次mouseenter一个视频就会更改
    try { clearInterval(interval) } catch { }
    let barObj = JSON.parse(localStorage.getItem(target.parentNode.parentNode.querySelector('.videoTitle').innerText))
    interval = setInterval(() => {//全局变量
        if (barObj) {
            const _bar = barObj.filter((targetBar) => {
                return targetBar.location === Math.floor(target.currentTime)
            }).forEach(element => {
                creatBarrage(element.content, target)
            })
        }
    }, 1000);
}


//将弹幕发送的函数
function creatBarrage(content, target) {
    const bar = document.createElement('p')
    bar.innerText = content
    runningBarrage.appendChild(bar)
    const setTime = Math.floor(Math.random() * 3 + 25) + 's'
    bar.style.animationDuration = setTime
    bar.style.animationPlayState = 'running'
    bar.style.top = (Math.floor(Math.random() * 5 + 1)) + 'rem'

    //视频作为父盒子的交叉观察对象
    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) {
            runningBarrage.removeChild(entries[0].target)
            observer.unobserve(entries[0].target)
        }
    }, {
        root: target.parentNode,
        threshold: 0
    })

    setTimeout(() => {
        observer.observe(bar)
    }, 100);
    //何时删掉这个弹幕:和盒子没有交叉的时候，就可以删除了
}

function formation(time) {
    let M = Math.floor(time / 60)
    M = (M < 10) ? '0' + M : M
    let S = Math.floor(time) % 60 + 1
    S = (S < 10) ? '0' + S : S
    const formationTime = M + ':' + S
    return formationTime
}