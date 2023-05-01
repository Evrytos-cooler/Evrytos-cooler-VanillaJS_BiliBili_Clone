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
    const collectList = document.querySelector('.collections .collectionList')
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