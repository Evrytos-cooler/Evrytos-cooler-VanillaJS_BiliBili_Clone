# Bilibili 仿站项目

## 项目概述

本项目是一个使用原生 JavaScript 实现的 Bilibili 网站仿站项目，旨在模拟 Bilibili 的核心功能和界面设计。项目包含了首页、视频播放页、个人中心等多个页面，实现了视频无限加载、弹幕系统、登录状态管理、评论系统等功能。

## 主要功能

1. **首页**

    - 视频无限加载：当用户滚动到页面底部时，自动加载更多视频
    - 导航栏固定：页面滚动时，顶部导航栏会固定在页面顶部
    - 登录状态管理：根据用户登录状态显示不同的界面元素
    - 视频预览：鼠标悬停视频时自动播放预览

2. **视频播放页**

    - 视频播放控制：支持播放、暂停、音量控制等功能
    - 弹幕系统：
        - 实时弹幕：视频播放时实时显示弹幕
        - 弹幕发送：用户可发送弹幕，弹幕会实时显示在视频中
        - 弹幕列表：显示所有弹幕，按时间排序
    - 视频信息展示：显示视频标题、作者、播放量等信息
    - 评论系统：
        - 多级评论：支持主评论和子评论
        - 评论回复：用户可对评论进行回复
        - 评论点赞：用户可为评论点赞
    - 视频收藏：用户可收藏视频，收藏状态会同步到个人中心

3. **个人中心**
    - 收藏夹管理：用户可以创建和管理自己的收藏夹
    - 视频列表展示：显示用户收藏的视频列表
    - 视频播放记录：记录用户观看过的视频
    - 评论管理：显示用户发布的评论和回复

## 技术栈

-   HTML5
-   CSS3
-   JavaScript (ES6+)
-   LocalStorage (用于存储用户登录状态、视频数据、评论和弹幕)

## 项目结构

```
d:\My_code\demo\fronted_chenzikai_bilibili
├── .git/
├── Note/
├── README.md
└── 二轮考核/
    ├── common.css
    ├── common.js
    ├── font_4051284_dgync8ldbo/
    │   ├── demo.css
    │   ├── demo_index.html
    │   ├── iconfont.css
    │   ├── iconfont.js
    │   └── iconfont.json
    ├── image/
    ├── index.css
    ├── index.html
    ├── index.js
    ├── index_1536px.css
    ├── person.css
    ├── person.html
    ├── person.js
    ├── person_1396px.css
    ├── signIn.css
    ├── signIn.js
    ├── video.css
    ├── video.html
    └── video.js
```

## 参考文档

-   [Bilibili](https://www.bilibili.com/)
-   [MDN Web Docs](https://developer.mozilla.org/zh-CN/)

## 技术笔记

-   在 Note 文件夹中，笔者给出了项目中所用到的技术/知识点的笔记，供各位同学学习参考。
-   小弟才疏学浅，恐难免疏漏错误，欢迎各位同学在 Issue 中提出建议，不吝赐教。

## 如何运行

1. 克隆本项目到本地
2. 打开 `二轮考核/index.html` 文件即可查看首页
3. 其他页面如 `video.html` 和 `person.html` 也可直接打开查看

## 贡献者

-   Chenzikia / Erytos

## 许可证

本项目遵循 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 许可证。  
**非商业用途**：本作品仅供学习和个人使用，禁止用于任何商业用途。  
详情请参阅 [LICENSE](LICENSE) 文件。
本项目仅做参考学习使用，不允许任何商业用途。
本项目遵循 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## English Version

# Bilibili Clone Project

## Project Overview

This project is a Bilibili website clone implemented using native JavaScript, aiming to simulate the core functionalities and interface design of Bilibili. The project includes multiple pages such as the homepage, video playback page, and personal center, and implements features like infinite video loading, a barrage system, login status management, and a comment system.

## Key Features

1. **Homepage**

    - Infinite Video Loading: Automatically loads more videos when the user scrolls to the bottom of the page
    - Fixed Navigation Bar: The top navigation bar remains fixed when the page is scrolled
    - Login Status Management: Displays different interface elements based on the user's login status
    - Video Preview: Automatically plays a preview when the user hovers over a video

2. **Video Playback Page**

    - Video Playback Control: Supports play, pause, and volume control
    - Barrage System:
        - Real-time Barrage: Displays barrages in real-time during video playback
        - Barrage Sending: Users can send barrages, which are displayed in real-time
        - Barrage List: Displays all barrages sorted by time
    - Video Information Display: Shows video title, author, and view count
    - Comment System:
        - Multi-level Comments: Supports main comments and sub-comments
        - Comment Replies: Users can reply to comments
        - Comment Likes: Users can like comments
    - Video Favorites: Users can favorite videos, and the status is synced to the personal center

3. **Personal Center**
    - Favorite Management: Users can create and manage their favorite lists
    - Video List Display: Shows the list of videos favorited by the user
    - Video Playback History: Records the videos watched by the user
    - Comment Management: Displays comments and replies posted by the user

## Tech Stack

-   HTML5
-   CSS3
-   JavaScript (ES6+)
-   LocalStorage (Used to store user login status, video data, comments, and barrages)

## Project Structure

```
d:\My_code\demo\fronted_chenzikai_bilibili
├── .git/
├── Note/
├── README.md
└── 二轮考核/
    ├── common.css
    ├── common.js
    ├── font_4051284_dgync8ldbo/
    │   ├── demo.css
    │   ├── demo_index.html
    │   ├── iconfont.css
    │   ├── iconfont.js
    │   └── iconfont.json
    ├── image/
    ├── index.css
    ├── index.html
    ├── index.js
    ├── index_1536px.css
    ├── person.css
    ├── person.html
    ├── person.js
    ├── person_1396px.css
    ├── signIn.css
    ├── signIn.js
    ├── video.css
    ├── video.html
    └── video.js
```

## References

-   [Bilibili](https://www.bilibili.com/)
-   [MDN Web Docs](https://developer.mozilla.org/zh-CN/)

## Technical Notes

-   In the Note folder, the author has provided notes on the technologies and knowledge points used in the project for all fellow students to learn and refer to.
-   I'm limited in knowledge and experience, so there may inevitably be omissions and errors. I sincerely welcome all students to raise suggestions in the Issues section and offer your valuable advice.

## How to Run

1. Clone this project to your local machine
2. Open the `二轮考核/index.html` file to view the homepage
3. Other pages such as `video.html` and `person.html` can also be opened directly

## Contributors

-   Chenzikia / Erytos

## License

This project is licensed under the MIT License. For more details, please refer to the [LICENSE](LICENSE) file.
