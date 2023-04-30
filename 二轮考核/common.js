const headerAvata = document.querySelector('header .headNav .rightNav li .avata');
(async () => {
    headerAvata.style = `background-image: url(${await getAvata(localStorage.getItem("loginUser"))})`
})();