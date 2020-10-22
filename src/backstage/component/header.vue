<template>
    <div class="header">
        <div class="logo">
            <img src="../../assets/logo/logo.png" alt="">
        </div>
        <div class="navas">
            <span>云课堂后台系统</span>
            <span>
                <img src="../../assets/image/out.png" alt="">
                退出
            </span>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.header{
    height: 54px;
    width: 100%;
    background: #18509E;
    box-sizing: border-box;
    padding: 0 30px 0 60px;
    display: flex;
    align-items: center;
    .logo{
        width: 220px;
        display: flex;
        align-items: center;
        align-content: flex-end;
        height: 40px;
        border-right: 1px solid #1A5EB8;
        img{
            height: 40px;
        }
    }
    .navas{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding-left: 15px;
        color: #FFFFFF;
        font-size: 15px;
        span{
            display: flex;
            align-items: center;
        }
        img{
            margin: 0 10px;
        }
        &:hover{
            cursor: pointer;
        }
    }
}
</style>