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
window.addEventListener("scroll", throttle(() => {
    //回调函数
    //如果页面划到了距离最下面有一定距离的地方，就渲染新的数据
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop//文档的滚动高度
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight//文档的总高度
    const clientHeight = document.documentElement.clientHeight || window.innerHeight//当前视窗的高度
    //逻辑或是为了兼容性
    if (scrollTop + clientHeight >= scrollHeight - 100) {//视窗高度加滚动高度接近总高度了
        //渲染新的html
        addVideo()
        //请求视频
        const sections = document.querySelectorAll('.content .loading')
        askForVideo(sections)
    }
}, 500))


    //但这个函数必须滚动起来才能触发，如果没有滚动,屏幕比较长，但是视频也没有加载好，就有问题
    //于是打开页面先判断够不够长，不够长就继续渲染
    (function checking() {
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
    }());//立刻执行函数记得加分号


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
function askForVideo(sections) {//参数是要请求加载的视频列表
    let observer = new IntersectionObserver((entries) => {
        //先发送ajax请求然后再forEach渲染
        fetch('https://frontend.exam.aliyun.topviewclub.cn/api/getHomePageVideo',
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
                    `        <div class='video' muted="true"><video src="${src}"></video></div>
                <p class="videoTitle">${title}</p>
                <p class="author">${author}</p>`
                entry.target.classList.remove('loading')
                entry.target.classList.add('ready')
                observer.unobserve(entry.target)
                replaceUrl(entry.target.firstElementChild, 'video.html?' + "src=" + `${JSON.stringify(response)}` + '&current=' + `${i}`)
                mouseenterPlay(entry.target.firstElementChild.firstElementChild)
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

//鼠标悬停播放视频
function mouseenterPlay(target) {//target是个media标签
    target.addEventListener('mouseenter', () => {
        target.muted = true
        target.play()
    })
    target.addEventListener('mouseleave', () => {
        target.pause()
    })
}