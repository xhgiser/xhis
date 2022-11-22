<template>
  <div class="register">
    <div class="bgp"></div>
    <div class="register_container">
      <h1>新汇集团工程信息化平台</h1>
      <el-form
        class="register_form"
        label-position="top"
        label-width="120px"
        style="max-width: 450px"
        :model="userInfo"
        :rules="rules"
        @keyup.enter="onRegister"
        ref="ref_form"
      >
        <el-form-item label="请输入用户账号:" prop="username">
          <el-input
            v-model="userInfo.username"
            placeholder="用户姓名全拼 未按要求将被禁用"
            clearable
          />
        </el-form-item>

        <el-form-item label="请输入用户初始密码:" prop="password">
          <el-input
            v-model="userInfo.password"
            placeholder="3~15位"
            clearable
          />
        </el-form-item>

        <el-form-item label="请输入用户名称:" prop="name">
          <el-input v-model="userInfo.name" placeholder="用户姓名" clearable />
        </el-form-item>

        <el-form-item label="请选择用户所在部门:" prop="user_department">
          <el-select v-model="userInfo.user_department" placeholder="请选择">
            <el-option label="集团高管" value="集团高管" />
            <el-option label="集团总师" value="集团总师" />
            <el-option label="工程数字技术公司" value="工程数字技术公司" />
            <el-option label="设计总院" value="设计总院" />
            <el-option label="勘测院" value="勘测院" />
            <el-option label="技术部" value="技术部" />
            <el-option label="规划院" value="规划院" />
            <el-option label="济南设计院" value="济南设计院" />
            <el-option label="青岛设计院" value="青岛设计院" />
            <el-option label="鲁南设计院" value="鲁南设计院" />
            <el-option label="重庆设计院" value="重庆设计院" />
            <el-option label="临沂设计院" value="临沂设计院" />
            <el-option label="济宁设计院" value="济宁设计院" />
          </el-select>
        </el-form-item>

        <el-form-item label="请选择用户类型:" prop="user_type">
          <el-select v-model="userInfo.user_type" placeholder="请选择">
            <!-- <el-option label="超级管理员" value="1" />
            <el-option label="管理员" value="2" /> -->
            <el-option label="普通用户" value="3" />
          </el-select>
        </el-form-item>

        <el-button
          type="success"
          plain
          class="register_submit"
          @click="onRegister"
          >注册</el-button
        >
        <el-button
          type="warning"
          plain
          class="register_submit go-login-btn"
          @click="onLogin"
          >注册完成,点击跳转登录页面</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script setup>
import router from '@/router/index'
import { reactive, ref } from 'vue'
import { getRegister } from '@/api/index'

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
  name: '',
  user_department: '',
  user_type: '',
})

/**
 * 表单数据校验规则
 */
const rules = {
  username: [{ required: 'true', trigger: 'blur', message: '账号不能为空' }],
  password: [{ required: 'true', trigger: 'blur', message: '密码不能为空' }],
  name: [{ required: 'true', trigger: 'blur', message: '用户名不能为空' }],
  user_department: [
    { required: 'true', trigger: 'blur', message: '用户所在部门为必选项' },
  ],
  user_type: [
    { required: 'true', trigger: 'blur', message: '用户类型为必选项' },
  ],
}

/**
 * 注册的方法
 */
const onRegister = () => {
  ref_form.value.validate((val) => {
    if (val) {
      getRegisterData()
    }
  })
}

/**
 * 注册的接口
 */
const getRegisterData = async () => {
  //接口的调用
  const res = await getRegister({
    username: userInfo.username,
    password: userInfo.password,
    name: userInfo.name,
    user_department: userInfo.user_department,
    user_type: userInfo.user_type,
  })
  //如果注册成功
  if (res?.message) {
    ElMessage({
      message: '注册成功！',
      type: 'success',
    })
    router.push('/login')
    //location.reload()
  }
}

/**
 * 跳转去登录页面
 */
const onLogin = () => {
  router.push('/login')
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

.register {
  height: 100%;

  .bgp {
    height: 100%;
    background-image: url('@/assets/images/register_bgp.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-attachment: fixed;
    background-position: 50% 50%;
  }

  .el-icon {
    height: 30px !important;
  }

  .register_container {
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

    .register_form {
      .register_submit {
        width: 100%;
        height: 50px;
        border-radius: 20px;
        margin-top: 15px;
      }

      :deep(.el-input-group__prepend) {
        padding: 0 10px;
      }

      :deep(.el-select) {
        width: 400px;
      }

      .go-login-btn {
        margin-left: 0px;
      }

      :deep(el-select-dropdown__item) {
        padding-right: 20px;
      }
    }
  }
}
</style>
