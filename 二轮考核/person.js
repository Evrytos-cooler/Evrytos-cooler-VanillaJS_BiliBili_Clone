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
