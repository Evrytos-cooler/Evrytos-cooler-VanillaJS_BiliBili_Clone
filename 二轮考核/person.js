//个人信息
const barUname = document.querySelector('.headImg .personalInfo .info .uname')
const barAvata = document.querySelector('.headImg .personalInfo .avata')
const hiddenBarAvata = document.querySelector('.hiddenMenu .hiddenAvata');
// 获取头像
(async () => {
    barAvata.style.backgroundImage = `url(${await getAvata(localStorage.getItem('loginUser'))})`
    hiddenBarAvata.style.backgroundImage = `url(${await getAvata(localStorage.getItem('loginUser'))})`
})()
barUname.innerHTML = localStorage.getItem('loginUser')

//显示收藏的视频

function refreshCollection(videoList) {//传入待渲染数据的数组
    const collectList = document.querySelector('.myClt.content .collections .collectionList')
    videoList.forEach(videoTarget => {
        const newCollection = document.createElement('div')
        newCollection.classList.add('collection')
        newCollection.innerHTML = `
    <div class="video">
    <video src="${videoTarget.videoSrc}"></video>
    <div class="mask">
    <p>播放: 20.2万</p>
    <p>收藏: 10万</p>
    <p>UP主: ${videoTarget.author}</p>
    <p>投稿: 5-1 </p>
    <i class='iconfont'>&#xe8c4;</i>
    </div>
    </div>
    <div class="description">
    <p>${videoTarget.title}</p>
    <p>${videoTarget.author}</p>
    <i class='iconfont more'>&#xe78d;</i>
    </div>
    `

        collectList.appendChild(newCollection)
        //获取视频的时间
        newCollection.querySelector('.video video').addEventListener('loadedmetadata', (e) => {
            newCollection.querySelector('.video').setAttribute('time-data', formation(e.target.duration))
        })

        //绑定点击事件
        const videoObj = {
            videos: videoList
        }
        replaceUrl(newCollection, 'video.html?' + "src=" + `${JSON.stringify(videoObj)}` + '&current=' + `${videoList.indexOf(videoTarget)}`)
    });
}
refreshCollection(JSON.parse(localStorage.getItem(`${localStorage.getItem('loginUser')}Info`)))//传入初始数组


// 更换头像
const changeAvataBtn = document.querySelector('.headImg .personalInfo .avata')
changeAvataBtn.addEventListener('click', async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.click()//模拟点击input，打开系统的资源管理器
    input.addEventListener('change', async () => {
        if (input.files.length === 0) {
            alert('请选择头像图片')
            return false
        }
        else {
            data = new FormData()
            data.append('avatarFile', input.files[0])
            data.append('username', `${localStorage.getItem('loginUser')
                }`)

            const response = await fetch('https://frontend.exam.aliyun.topviewclub.cn/api/changeAvatar', {
                method: 'POST',
                body: data
            })
            if (response.ok === true && response.status === 200) location.reload();
            else console.warn(response.status);
        }
    })
})

// 模拟ajax部分刷新
const myClt = document.querySelector('.myClt.content ')
const myVideo = document.querySelector('.myVideo.content ')
const CltBtn = document.querySelector('.menuBar .option li:nth-of-type(4)')
const VideoBtn = document.querySelector('.menuBar .option li:nth-of-type(3)')
CltBtn.addEventListener('click', (e) => {
    myClt.style.display = 'flex'
    myVideo.style.display = 'none'
})

VideoBtn.addEventListener('click', (e) => {
    myClt.style.display = 'none'
    myVideo.style.display = 'flex'
})

//投稿功能
const submmitBtn = document.querySelector('header .headNav .rightNav li a button')

submmitBtn.addEventListener('click', async (e) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.click()
    input.addEventListener('change', async (_e) => {
        if (input.files.length === 0) {
            alert('请选择视频')
            return false
        }
        else {

            //创建mask
            const mask = document.createElement('div')
            mask.classList.add('inputTitleMask')
            document.querySelector('body').appendChild(mask)
            //创建输入标题的模态框
            const box = document.createElement('div')
            box.classList.add('inputTitle')
            document.querySelector('body').appendChild(box)



            //关闭按钮
            box.innerHTML = `        <div class="close">关闭</div>
            <div class="title"><input type="text" placeholder="请输入标题"></div>
            <div class="describe"><input type="text" placeholder="请输入简介"></div><button>投稿</button>`
            box.querySelector('.close').addEventListener('click', () => {
                document.querySelector('body').removeChild(box)
                document.querySelector('body').removeChild(mask)
            })
            //提交按钮
            box.querySelector('button').addEventListener('click', () => {
                //获取数据
                const title = box.querySelector('.title input').value
                const describe = box.querySelector('.describe input').value
                const author = localStorage.getItem('loginUser')
                const authorAvatarSrc = getAvata(author)
                // 获取临时url,记得要清除缓存,这里传的是视频，不是url方便清理在视频加载完的时候清理缓存
                const videoSrc = URL.createObjectURL(input.files[0])

                let myList = null
                if (localStorage.getItem(`${author}\`s video`) != null) {
                    myList = JSON.parse(localStorage.getItem(`${author}\`s video`))
                }
                else {
                    myList = new Array()
                }
                const newVideo = new MyVideo(author, authorAvatarSrc, describe, title, videoSrc)
                myList.push(newVideo)
                localStorage.setItem(`${author}\`s video`, JSON.stringify(myList))
                displayMyVideo(myList)
            })
        }
    })
})


// 构造视频对象
function MyVideo(author, authorAvatarSrc, describe, title, videoSrc) {
    this.author = author
    this.authorAvatarSrc = authorAvatarSrc
    this.describe = describe
    this.title = title
    this.videoSrc = videoSrc
}

// 显示投稿的功能,必须有服务端的支持才能显示
function displayMyVideo(videoList) {//传入待渲染数据的数组
    if (videoList === null) return
    const collectList = document.querySelector('.myVideo.content .collections .collectionList')
    collectList.innerHTML = ''
    videoList.forEach(videoTarget => {
        const newCollection = document.createElement('div')
        newCollection.classList.add('collection')
        newCollection.innerHTML = `
    <div class="video" time-data="${videoTarget.duration}">
    <video src="${videoTarget.videoSrc}"></video>
    <div class="mask">
    <p>播放: 20.2万</p>
    <p>收藏: 10万</p>
    <p>UP主: ${videoTarget.author}</p>
    <p>投稿: 5-1 </p>
    </div>
    </div>
    <div class="description">
    <p>${videoTarget.title}</p>
    <p>${videoTarget.author}</p>
    </div>
    `
        collectList.appendChild(newCollection)
        //清理缓存
        // newCollection.querySelector('.video video').onload = () => {
        //     URL.revokeObjectURL(videoTarget.videoSrc)
        // }

        newCollection.querySelector('.video video').addEventListener('loadedmetadata', (e) => {
            newCollection.querySelector('.video').setAttribute('time-data', formation(e.target.duration))
        })

        //绑定点击事件
        const videoObj = {
            videos: videoList
        }
        replaceUrl(newCollection, 'video.html?' + "src=" + `${JSON.stringify(videoObj)}` + '&current=' + `${videoList.indexOf(videoTarget)}`)
    });
}

displayMyVideo(JSON.parse(localStorage.getItem(`${localStorage.getItem('loginUser')}\`s video`)))



async function getAvata(uname) {
    //发送ajax请求
    const response = await fetch(`https://frontend.exam.aliyun.topviewclub.cn/api/getAvatar?username=${uname}`, {
        method: 'POST',
    })
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    return url
}

// 编辑栏拖动排序
let dragList = document.querySelector('.content .edit ul')//还有一个所以要再来一次
let draggedElement;
let draggedOrder;
let animation = false;//标记做动画的过程，在这个过程中不能再次触发动画了
dragList.addEventListener('dragstart', (e) => {
    draggedElement = e.target
    draggedOrder = Array.from(draggedElement.parentNode.children).indexOf(draggedElement)
})

dragList.addEventListener('dragenter', (e) => {//只有进入的时候会执行   
    e.preventDefault()
    let order = Array.from(e.target.parentNode.children).indexOf(e.target)
    //判断先后，执行动画，调换位置：
    if (e.target !== draggedElement && !animation) {
        if ((order > draggedOrder)) {
            animation = true
            draggedElement.classList.add("dragSortingDown")
            e.target.classList.add("dragSortingUp")
            e.target.addEventListener("animationend", () => {
                dragList.insertBefore(e.target, draggedElement)
                e.target.classList.remove("dragSortingUp")
                draggedElement.classList.remove("dragSortingDown")
                animation = false
                //更新拖动元素的下标
                draggedOrder = Array.from(e.target.parentNode.children).indexOf(draggedElement)

                return;
            })
        }
        else if ((order < draggedOrder)) {
            animation = true
            e.target.classList.add("dragSortingDown")
            draggedElement.classList.add("dragSortingUp")
            e.target.addEventListener("animationend", () => {
                dragList.insertBefore(draggedElement, e.target)
                e.target.classList.remove("dragSortingDown")
                draggedElement.classList.remove("dragSortingUp")
                animation = false
                //更新拖动元素的下标
                draggedOrder = Array.from(e.target.parentNode.children).indexOf(draggedElement)

                return;
            })
        }
    }
})

dragList.addEventListener('dragover', (e) => {
    e.preventDefault()
})


//给另一个界面的也绑定一下 ------------------------------
let _dragList = document.querySelectorAll('.content .edit ul')[1]
let _draggedElement;
let _draggedOrder;
let _animation = false;//标记做动画的过程，在这个过程中不能再次触发动画了
_dragList.addEventListener('dragstart', (e) => {
    _draggedElement = e.target
    _draggedOrder = Array.from(_draggedElement.parentNode.children).indexOf(_draggedElement)
})

_dragList.addEventListener('dragenter', (e) => {//只有进入的时候会执行   
    e.preventDefault()
    let order = Array.from(e.target.parentNode.children).indexOf(e.target)
    //判断先后，执行动画，调换位置：
    if (e.target !== _draggedElement && !_animation) {
        if ((order > _draggedOrder)) {
            _animation = true
            _draggedElement.classList.add("dragSortingDown")
            e.target.classList.add("dragSortingUp")
            e.target.addEventListener("animationend", () => {
                _dragList.insertBefore(e.target, _draggedElement)
                e.target.classList.remove("dragSortingUp")
                _draggedElement.classList.remove("dragSortingDown")
                _animation = false
                //更新拖动元素的下标
                _draggedOrder = Array.from(e.target.parentNode.children).indexOf(_draggedElement)

                return;
            })
        }
        else if ((order < _draggedOrder)) {
            _animation = true
            e.target.classList.add("dragSortingDown")
            _draggedElement.classList.add("dragSortingUp")
            e.target.addEventListener("animationend", () => {
                _dragList.insertBefore(_draggedElement, e.target)
                e.target.classList.remove("dragSortingDown")
                _draggedElement.classList.remove("dragSortingUp")
                _animation = false
                //更新拖动元素的下标
                _draggedOrder = Array.from(e.target.parentNode.children).indexOf(_draggedElement)

                return;
            })
        }
    }
})

_dragList.addEventListener('dragover', (e) => {
    e.preventDefault()
})


//给每个视频绑定点击跳转事件
function replaceUrl(target, url) {
    target.addEventListener('click', () => {
        window.open(url)
    })
}


// 下滑导航栏
const hiddenMenu = document.querySelector('.hiddenMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        console.log(window.scrollY)
        hiddenMenu.style.top = '0';
    }
    else {
        hiddenMenu.style.top = '-80px';

    }
})

//收藏栏编辑样式
const editExpend = document.querySelector('.content .edit .myCreating .name i')
const edit = document.querySelector('.content .edit .myCreating')
let editHeight = edit.clientHeight + 5 + 'px'
edit.style.height = editHeight

editExpend.addEventListener('click', () => {
    if (editExpend.classList.contains('fold')) {
        edit.style.height = editHeight
    }
    else {
        edit.style.height = '60px'
    }
    editExpend.classList.toggle('fold')
})

//点击变色效果
const editUl = document.querySelector('.content .edit .myCreating ul')
const editLi = editUl.querySelectorAll('li')

editUl.addEventListener('click', (e) => {
    editLi.forEach(target => {
        target.classList.remove('active')
    })
    e.target.classList.add('active')
})

function formation(time) {
    let M = Math.floor(time / 60)
    M = (M < 10) ? '0' + M : M
    let S = Math.floor(time) % 60 + 1
    S = (S < 10) ? '0' + S : S
    const formationTime = M + ':' + S
    return formationTime
}