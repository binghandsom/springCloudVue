<template>
    <div id="chat" class="chat">
        <div class="zz" v-if="zzFlag">
            <div>
                <input type="text" placeholder="输入昵称" v-model="name" @keyup.enter="toggleZZ">
            </div>
        </div>
        <div class="chat-left">
            <div class="chat-left-item">
                <div class="chat-head">
                    公屏:
                </div>
                <div class="chat-content" ref="public" @mouseover="publicScroll=false" @mouseout="publicScroll=true">
                    <wton-message :message="item" v-for="(item,index) in messages" :key="index"
                                  v-on:exec="extractUserId"></wton-message>

                </div>
            </div>
            <div class="chat-left-item">
                <div class="chat-head">
                    私聊:
                </div>
                <div class="chat-content" ref="private" @mouseover="privateScroll=false" @mouseout="privateScroll=true">
                    <wton-message :message="item" v-for="(item,index) in priMessages" :key="index"
                                  v-on:exec="extractUserId"></wton-message>

                </div>
            </div>
            <div class="chat-left-item">
                <div>
                    发送列表:
                    <ul>
                        <li v-for="item in sendList" @click="removeSendList(item)">
                            {{item}}
                        </li>
                    </ul>
                </div>
                <div>

                    <input v-model="message" :placeholder="prompting"
                           @keyup.ctrl.enter="sendSomeOne" @keyup.enter="sendAll">
                </div>
                <div>
                    <button @click="sendAll">发送公屏</button>
                    <button @click="sendSomeOne">发送私聊</button>
                </div>
            </div>
        </div>
        <div class="chat-right">
            <div class="chat-right-item">
                <span>在线人数:{{userList.length}}</span>
                <ul>
                    <li v-for="item in userList" @click="addSendList(item)">
                        {{item == name ? item + '(你)' : item}}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../assets/scss/variables.scss";

    .chat {
        display: flex;
        justify-content: space-between;
        width: 1000px;
        > div {
            margin: 0px 5px;
        }
        .chat-left {
            display: flex;
            width: 100%;
            border: solid 1px;
            flex-flow: column;
            align-items: center;
            margin-left: -5px;

            .chat-left-item {
                margin: 20px;
                width: 550px;
                height: 300px;
                border: solid 1px;
                border-radius: 15px;
                span {
                    margin-left: 5px;
                }
                li {
                    cursor: pointer;
                }
            }
        }
        .chat-right {
            display: flex;
            border: solid 1px;
            flex-flow: column;
            align-items: center;
            .chat-right-item {
                margin: 50px;
                width: 100%;
                span {
                    text-align: center
                }
                li {
                    cursor: pointer;
                    margin-top: 5px;
                }
            }
        }
        .zz {
            display: flex;
            position: fixed;
            z-index: 999;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, .5);
            transition: opacity .3s ease;
            margin: 0px;
        }
    }

    .chat-head {
        height: 25px;
        background: #878ECD;
        color: #ffffff;
        border-radius: 15px 15px 0px 0px;
        padding: 10px 25px;
    }

    .chat-content {

        height: 250px;
        overflow-x: hidden;
    }
</style>
<script>
    import {SET_MESSAGE} from '../store/types'
    import wtonMessage from '../components/common/wton-message.vue'

    export default {
        data() {
            return {
                message: null,
                websocketClient: null,
                prompting: '发送消息',
                userId: '机器人' + parseInt(Math.random() * 100) + '号',
                targetId: null,
                sendList: [],
                name: null,
                zzFlag: true,
                publicScroll: true,
                privateScroll: true
            }
        },
        filters: {
            toggleName(name, ss) {
        /*        console.log(name)
                console.log(ss)*/
            }
        },
        asyncData({store, route}) {
        },
        methods: {
            sendMessage(targetId, type) {
                if (this.message != null) {
                    let msg = JSON.stringify(this.setMessage(targetId, type));
                    this.websocketClient.send(msg);
                    this.prompting = '发送消息'
                } else {
                    this.prompting = '发送消息不能为空'
                }
            },
            sendSomeOne() {
                console.log(this.sendTargets)
                let msg = this.setMessage(this.sendTargets, "SET_PRIVATE_MESSAGE")
                this.$store.commit(msg.type, {data: JSON.stringify(msg)});
                this.sendList.forEach((targetId) => {
                    console.log(targetId)
                    this.sendMessage(targetId, msg.type)
                })
                this.message = null;
            },
            sendAll(type) {
                console.log('sendall')
                this.sendMessage("sendAll", "SET_MESSAGE");
                this.message = null;
            },
            addSendList(userId) {
                console.log(userId)
                if (userId != this.name && !this.sendList.includes(userId)) {
                    this.sendList.push(userId);
                }
            },
            extractUserId({userId}) {
                console.log(userId)

                this.addSendList(userId)
            },
            removeSendList(userId) {
                let temp = this.sendList.filter((e) => {
                    if (e != userId) return true;
                });
                this.sendList = [];
                this.sendList.push(...temp)
            },
            toggleZZ() {
                if (this.name != null && this.name != '') {
                    this.$store.commit("SET_NAME", this.name)
                    this.zzFlag = false;

                    this.websocketClient = new WebSocket("wss://localhost:9999/initWebsocket?" + this.name)
                    this.$store.dispatch("INIT_WEBSOCKET", this.websocketClient)
                }
            },
            setMessage(targetId, type) {
                return {
                    userId: this.name,
                    text: this.message,
                    targetId: targetId,
                    type: type
                }
            }
        },
        mounted() {
            //this.toggleZZ()
        },
        computed: {
            messages() {
                return this.$store.state.messages;
            },
            userList() {
                return this.$store.state.userList;
            },
            priMessages() {
                return this.$store.state.priMessages;
            },
            sendTargets() {
                let st = '';
                this.sendList.forEach(e => {
                    st += e + ",";
                })
                return st.substring(0, st.length - 1);
            }
        },
        components: {
            wtonMessage
        },
        updated: function () {
            if (this.publicScroll) {
                this.$refs.public.scrollTop = this.$refs.public.scrollHeight
            }
            if (this.private) {
                this.$refs.private.scrollTop = this.$refs.private.scrollHeight
            }
        },
        beforeRouteLeave(to, from, next) {
            this.websocketClient.close();
            next();
        }
    }
</script>
