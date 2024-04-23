<template>
  <div>
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">导航栏</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/weth" class="nav-link">WETH质押</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contract" class="nav-link">USDT质押</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/ve" class="nav-link">VE通证</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/usdt" class="nav-link">USDT通证</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/crv" class="nav-link">CRV通证</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 主内容区域，用于显示路由对应的组件 -->
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
};
</script>

<style>
/* Reset 样式，清除默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 导航栏样式 */
.navbar {
  background-color: rgba(0, 0, 0, 0); /* 完全透明 */
  padding: 10px 0;
  border-color: rgba(0, 0, 0, 0); /* 完全透明 */
  max-width: 600px; /* 限制导航栏的最大宽度 */
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.navbar-nav {
  margin-left: auto;
}

.nav-item {
  list-style: none;
}

.nav-link {
  text-decoration: none;
  color: #333;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #e9ecef;
}

/* 主内容区域样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 全局链接样式 */
a {
  text-decoration: none;
  color: #007bff;
}

a:hover {
  text-decoration: underline;
}

/* 添加动态背景 */
body {
  background-image: url('./assets/images/about-img.png'); /* 替换为您的图片链接 */
  background-size: cover;
  background-position: center;
}

</style>
