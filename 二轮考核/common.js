const headerAvata = document.querySelector('header .headNav .rightNav li .avata');
(async () => {
    headerAvata.style = `background-image: url(${await getAvata(localStorage.getItem("loginUser"))})`
})();

headerAvata.addEventListener('click', () => {
    if (localStorage.getItem('login') === 'true') {
        window.open('./person.html')
    }
})

//获取头像的函数
async function getAvata(uname) {
    //发送ajax请求
    const response = await fetch(`https://frontend.exam.aliyun.topviewclub.cn/api/getAvatar?username=${uname}`, {
        method: 'POST',
    })
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    return url
}


// 搜索栏行为
const search = document.querySelector('header .headNav.fixed form .input input')
search.addEventListener('focus', () => {
    search.parentNode.style.backgroundColor = 'transparent'
})

search.addEventListener('blur', () => {
    search.parentNode.style.backgroundColor = '#f2f3f4'
})