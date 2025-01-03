<template>
    <router-view/>
</template>
<style lang="less">
    * {
        margin: 0;
        padding: 0;
    }

    body {
        width: 100%;
        height: 100vh;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    ::-webkit-scrollbar {
        //display: none;/
        width: 10px;
        background: #fafafa;
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background: #ededed;
        border-radius: 5px;
    }

    ::-webkit-scrollbar-button {
        display: none;
    }

    #app {
        margin-bottom: 100px;
    }

    .tabTitle {
        display: block;
        margin: 0 auto;
        height: 80px;

        p {
            height: 100%;
            line-height: 80px;
            text-align: center;
            width: 200px;
            border: 1px solid #EBEEF5;
        }
    }

    li {
        list-style: none;
    }
</style>
