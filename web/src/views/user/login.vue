<template>
  <div class="login">
    <div class="bgp"></div>
    <div class="login_container">
      <h1>新汇集团工程信息化平台</h1>
      <el-form
        class="login_form"
        :model="userInfo"
        :rules="rules"
        @keyup.enter="onLogin"
        ref="ref_form"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model.trim="userInfo.username"
            clearable
          >
            <template #prepend>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            show-password
            v-model.trim="userInfo.password"
            clearable
          >
            <template #prepend>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-button type="primary" plain class="login_submit" @click="onLogin"
          >登录</el-button
        >
        <el-button type="success" plain class="login_submit" @click="onRegister"
          >注册</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script setup>
import router from '@/router/index'
import { reactive, ref } from 'vue'
import { getLogin } from '@/api/index'

/**
 * 初始的ref
 */
const ref_form = ref(null)

/**
 * 表单的数据声明
 */
const userInfo = reactive({
  username: '',
  password: '',
})

/**
 * 表单数据校验规则
 */
const rules = {
  username: [{ required: 'true', trigger: 'blur', message: '用户名不能为空' }],
  password: [{ required: 'true', trigger: 'blur', message: '密码不能为空' }],
}

/**
 * 登录的方法
 */
const onLogin = () => {
  ref_form.value.validate((val) => {
    if (val) {
      getLoginData()
    }
  })
}

/**
 * 登录的接口
 */
const getLoginData = async () => {
  //接口的调用
  const res = await getLogin({
    username: userInfo.username,
    password: userInfo.password,
  })
  //如果登录成功
  if (res?.token) {
    localStorage.setItem('token', res?.token)
    ElMessage({
      message: '登录成功！',
      type: 'success',
    })
    router.push('/home')
  }
}

const onRegister = () => {
  router.push('/register')
}
</script>

<style lang="less" scoped>
@-webkit-keyframes fadenum {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.login {
  height: 100%;

  .bgp {
    height: 100%;
    background-image: url('@/assets/images/login_bgp.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-attachment: fixed;
    background-position: 50% 50%;
  }

  .el-icon {
    height: 30px !important;
  }

  .login_container {
    animation: fadenum 1s ease;
    position: absolute;
    z-index: 1;
    width: 400px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s;
    min-height: 273px;
    text-align: center;
    background-color: rgba(215, 205, 179, 0.734);
    border-radius: 10px;
    padding: 20px;

    h1 {
      font-size: 26px;
      transition: all 1s;
      font-weight: bold;
      margin-bottom: 36px;
      color: #505255;
    }

    .el-card {
      border-radius: 20px;
    }

    .login_form {
      .login_submit {
        width: 100%;
        height: 50px;
        border-radius: 20px;
        margin-top: 15px;
        margin-left: 1px;
      }

      :deep(.el-input-group__prepend) {
        padding: 0 10px;
      }

      :deep(.el-input__inner) {
        height: 50px;
      }
    }
  }
}
</style>
