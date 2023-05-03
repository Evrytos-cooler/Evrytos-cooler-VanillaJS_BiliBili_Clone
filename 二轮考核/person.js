//个人信息
const barUname = document.querySelector('.headImg .personalInfo .info .uname')
const barAvata = document.querySelector('.headImg .personalInfo .avata');
// 获取头像
(async () => {
    barAvata.style.backgroundImage = `url(${await getAvata(localStorage.getItem('loginUser'))})`
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
    </div>
    <div class="description">
    <p>${videoTarget.title}</p>
    <p>${videoTarget.author}</p>
    </div>
    `
        collectList.appendChild(newCollection)
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
            box.querySelector('button').addEventListener('click', async () => {
                //获取数据
                const title = box.querySelector('.title input').value
                const describe = box.querySelector('.describe input').value
                const author = localStorage.getItem('loginUser')
                const authorAvatarSrc = await getAvata(author)
                // 获取临时url,记得要清除缓存,这里传的是视频，不是url方便清理在视频加载完的时候清理缓存
                const videoSrc = URL.createObjectURL(input.files[0])

                let myList = null
                if (localStorage.getItem(`${author}\`s video`) != null) {
                    myList = JSON.parse(localStorage.getItem(`${author}\`s video`))
                }
                else {
                    myList = new Array()
                }

                myList.push(new MyVideo(author, authorAvatarSrc, describe, title, videoSrc))
                localStorage.setItem(`${author}\`s video`, JSON.stringify(myList))
                displayMyVideo(myList)
            })//返回一个视频对象
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
    <div class="video">
    <video src="${videoTarget.videoSrc}"></video>
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
        console.log(newCollection.querySelector('.video video'))
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
let dragList = document.querySelector('.content .edit ul')
let draggedElement;
let draggedOrder;
dragList.addEventListener('dragstart', (e) => {
    draggedElement = e.target
    draggedOrder = Array.from(draggedElement.parentNode.children).indexOf(draggedElement)
})

dragList.addEventListener('dragenter', (e) => {
    let order = Array.from(e.target.parentNode.children).indexOf(e.target)
    console.log(order)
})