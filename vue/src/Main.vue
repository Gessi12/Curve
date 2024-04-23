<template>
  <div :style="{ backgroundImage: 'url(' + dynamicBackground + ')' }">
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

    <!-- 主内容区域 -->
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      dynamicBackground: require('@/assets/images/dynamic-background.jpg') // 设置动态背景图像的路径
    };
  }
};
</script>

<style>
/* 样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.navbar {
  background-color: #f8f9fa;
  padding: 10px 0;
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

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

a {
  text-decoration: none;
  color: #007bff;
}

a:hover {
  text-decoration: underline;
}
</style>
