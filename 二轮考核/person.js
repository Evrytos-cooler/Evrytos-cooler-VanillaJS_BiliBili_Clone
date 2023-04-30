//个人信息
const barUname = document.querySelector('.headImg .personalInfo .info .uname')
const barAvata = document.querySelector('.headImg .personalInfo .avata');
// 获取头像
(async () => {
    barAvata.style.backgroundImage = `url(${await getAvata(localStorage.getItem('loginUser'))})`
})()
barUname.innerHTML = localStorage.getItem('loginUser')

//显示收藏的视频
