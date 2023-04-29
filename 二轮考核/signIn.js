//触发条件是点击了需要登录的按钮，所以这些按钮都需要绑定事件并判断登录与否，登录状态由localStorage显示
localStorage.setItem('login', 'false')//默认是不登陆的

function User(uname, pwd) {
    this.uname = uname
    this.pwd = pwd
}


//创建登录框框
function signInBox() {
    const mask = document.createElement('div')
    mask.classList.add('signInMask')
    document.querySelector('body').appendChild(mask)
    const box = document.createElement('div')
    box.classList.add('signInBox')
    box.innerHTML = `        
    <div class="option">
    <div class="signIn">注册</div>
    <div class="logIn">登录</div>
    </div>

    <div class="input">
    <div id="uname">账号<input type="text" name='uname' id='uname' placeholder="请输入账号"></div>
    <div id="pwd">密码<input type="password" name="pwd" id="pwd" placeholder="请输入密码"></div>
    </div>

    <div class="btn">
    <button>注册</button>
    <button>登录</button>
    </div>
    `
    document.querySelector('body').appendChild(box)
    const close = document.createElement('div')
    close.innerText = 'X'
    close.classList.add('close', 'iconfont')
    box.appendChild(close)
    close.addEventListener('click', () => {
        removeBox()
    })

    const signIn = box.querySelector('.btn button:first-of-type')
    const logIn = box.querySelector('.btn button:last-of-type')
    const uname = document.querySelector('#uname input')
    const pwd = document.querySelector('#pwd input')

    uname.addEventListener('focus', () => {
        uname.value = ''
        uname.classList.remove('error')
    })

    pwd.addEventListener('focus', () => {
        pwd.value = ''
        pwd.classList.remove('error')
    })

    signIn.addEventListener('click', () => {
        user = new User(uname.value, pwd.value)
        let UserList = null

        //获取旧的数据
        if (!JSON.parse(localStorage.getItem('UserList'))) {
            UserList = new Array()
        }
        else {
            UserList = JSON.parse(localStorage.getItem('UserList'))
        }



        if (UserList.every(item => {
            return item.uname !== user.uname
        })

        ) {
            UserList.push(user)
            localStorage.setItem('UserList', JSON.stringify(UserList))
            //注册成功要执行success
            success(user.uname)

        }
        else {
            uname.value = ''
            uname.setAttribute('placeholder', '用户名已被占用')
            uname.classList.add('error')
        }

    })

    logIn.addEventListener('click', () => {
        user = new User(uname.value, pwd.value)

        //获取旧的数据
        if (!JSON.parse(localStorage.getItem('UserList'))) {
            console.log('用户名或密码错误,')
        }
        else {
            UserList = JSON.parse(localStorage.getItem('UserList'))
        }

        if (UserList.find(item => {
            return item.uname = user.uname
        }).pwd === user.pwd) {
            success(user.uname)
        }
        else {
            uname.value = ''
            uname.setAttribute('placeholder', '用户名或密码错误')
            uname.classList.add('error')
            pwd.value = ''
            pwd.setAttribute('placeholder', '用户名或密码错误')
            pwd.classList.add('error')
        }




    })
}

signInBox()

function removeBox() {
    document.querySelector('.signInBox').style.display = 'none'
    document.querySelector('.signInMask').style.display = 'none'
}

function success(user) {
    localStorage.setItem('login', 'true')
    // 登录成功的话要显示登录当前的人的信息，在发弹幕或者评论收藏的时候要用到
    localStorager.setItem('loginUser', user)
    //刷新页面，加载那些登陆后才能显示的东西

}
