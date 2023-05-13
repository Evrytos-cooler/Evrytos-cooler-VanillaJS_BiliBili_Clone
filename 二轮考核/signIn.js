//触发条件是点击了需要登录的按钮，所以这些按钮都需要绑定事件并判断登录与否，登录状态由localStorage显示
// localStorage.setItem('login', 'false')//默认是不登陆的

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
    <div id="pwd">密码<input type="password" name="pwd" id="pwd" placeholder="请输入密码"><i class='iconfont'>&#xe901;
    </i><p>忘记密码？</p></div>
    </div>

    <div class="btn">
    <button>注册</button>
    <button>登录</button>
    </div>
    <i class='iconfont close'>&#xed1e;</i>
    <div class='other'>
    <p>其他方式登录</p>
    <div class='wx'> <i class='iconfont'>&#xe631;</i><p>微信登录</p></div>
    <div class='wb'> <i class='iconfont'>&#xe65a;</i><p>微博登录</p></div>
    <div class='qq'> <i class='iconfont'>&#xe614;</i><p>QQ登录</p></div>
    </div>
    <div class='copyRight'><p>未注册过哔哩哔哩的手机号，我们也不会帮你自动注册账号</p><p>登录或者注册完成即代表你同意<i>用户协议</i>和<i>隐私政策</i></p></div>
    
    
    `
    document.querySelector('body').appendChild(box)
    const close = box.querySelector('.close')
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

        const key = UserList.find(item => {
            return item.uname === user.uname
        }).pwd
        if (key === user.pwd) {//密码可以加密
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
if (localStorage.getItem('login') === 'false') {
    signInBox()
}


function removeBox() {
    document.querySelector('.signInBox').style.display = 'none'
    document.querySelector('.signInMask').style.display = 'none'
}

function success(user) {
    localStorage.setItem('login', 'true')
    // 登录成功的话要显示登录当前的人的信息，在发弹幕或者评论收藏的时候要用到
    localStorage.setItem('loginUser', user)
    //刷新页面，加载那些登陆后才能显示的东西
    location.reload()
    close.click()


}

function logOut() {
    localStorage.setItem('login', 'false')//默认是不登陆的
    localStorage.removeItem('loginUser')
}
// logOut()

// 输入密码的时候捂脸,点击眼睛切换可视状态
const eye = document.querySelector('.signInBox .input #pwd i')
const pwdInput = document.querySelector('.signInBox .input input#pwd')
const sBox = document.querySelector('.signInBox')
let isEyeopen = false

eye.addEventListener('click', () => {
    if (isEyeopen) {
        eye.innerHTML = '&#xe901;'
        isEyeopen = false
        pwdInput.setAttribute('type', 'password')

    }
    else {
        eye.innerHTML = '&#xe605;'
        isEyeopen = true
        pwdInput.setAttribute('type', 'text')

    }
})


pwdInput.addEventListener("focus", () => {
    sBox.classList.toggle('eyeClose')
})

pwdInput.addEventListener("blur", () => {
    sBox.classList.toggle('eyeClose')
})