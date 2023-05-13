
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
const _headNav = document.querySelector('header .headNav')
const search = document.querySelector('header .headNav form .input input')
let searchFocus = false

search.addEventListener('mouseenter', () => {
    if (!searchFocus) {
        if (_headNav.classList.contains('fixed')) {
            search.parentNode.style.backgroundColor = 'transparent'
        }
        else {
            search.parentNode.style.backgroundColor = '#fff'
        }
    }

})
search.addEventListener('mouseleave', () => {
    if (!searchFocus) {
        if (_headNav.classList.contains('fixed')) {
            search.parentNode.style.backgroundColor = '#f2f3f4'
        }
        else {
            search.parentNode.style.backgroundColor = '#ffffffc4'
        }
    }
})

search.addEventListener('focus', () => {
    search.parentNode.style.backgroundColor = '#e3e5e7'
    searchFocus = true
})

search.addEventListener('blur', () => {
    if (_headNav.classList.contains('fixed')) {
        search.parentNode.style.backgroundColor = '#f2f3f4'
    }
    else {
        search.parentNode.style.backgroundColor = '#ffffffc4'
    }
    searchFocus = false
})



// hover头像，头像方法，登出按键
const funcAvata = document.querySelector('header .headNav .rightNav li .avata')
funcAvata.addEventListener('mouseenter', () => {
    funcAvata.classList.add("active")
    funcHidden.classList.add("active")

})

const funcHidden = document.querySelector('header .headNav .rightNav li .hidden')
funcHidden.addEventListener('mouseleave', () => {
    funcAvata.classList.remove("active")
    funcHidden.classList.remove("active")
})

funcAvata.addEventListener('mouseleave', (e) => {
    if (e.clientY - 45 < funcAvata.offsetTop) {
        funcAvata.classList.remove("active")
        funcHidden.classList.remove("active")
    }



})
const logOutBtn = document.querySelector('header .headNav .rightNav li .hidden button')
logOutBtn.addEventListener("click", () => {
    if (login) { logOut() }
    location.reload()
})

funcAvata.addEventListener("click", () => {
    if (!login) {
        location.reload()
    }

})
