import { init, classModule, styleModule, propsModule, h, eventListenersModule } from 'snabbdom';
const patch = init([classModule, styleModule, propsModule, eventListenersModule]);

class Modal {
    constructor() {
        this.vnode = null;
        this.dialog = null;
    }

    createVnode() {
        return h('div#modal.modal', [
            h(
                'div.modal-dialog.layer-anim-00',
                {
                    on: {
                        animationstart: (e) => {
                            if (e.animationName === 'layer-bounceIn') {
                                this.vnode.elm.style.display = 'block';
                                this.vnode.elm.style.opacity = 0;
                            }
                        },
                        animationend: (e) => {
                            if (e.animationName === 'layer-bounceOut') {
                                e.target.style.display = 'none';
                                e.target.classList.remove('layer-anim-00', 'layer-anim-close');
                            }
                        },
                    },
                },
                [
                    h('div.modal-content', [
                        h('div.modal-header', [
                            h('div.modal-title', '标题'),
                            h(
                                'button.btn-close',
                                {
                                    props: { type: 'button' },
                                    on: {
                                        click: (e) => {
                                            this.close();
                                        },
                                    },
                                },
                                [h('span', {})],
                            ),
                        ]),
                        h('div.modal-body', [h('div', { style: { height: '100px' } })]),
                        h('div.modal-footer', [
                            h('button.btn.btn-secondary', { props: { type: 'button' } }, '关闭'),
                            h('button.btn.btn-primary', { props: { type: 'button' }, style: { marginLeft: '12px' } }, '确定'),
                            {
                                on: {
                                    click: (e) => {
                                        const buttonText = e.target.textContent;
                                        if (buttonText === '确定') {
                                            this.trigger('modal-confirm');
                                        } else if (buttonText === '关闭') {
                                            this.close();
                                            this.trigger('modal-close');
                                        }
                                    },
                                },
                            },
                        ]),
                    ]),
                ],
            ),
        ]);
    }

    initialRender() {
        const modal = document.getElementById('modal');
        if (modal) {
            this.vnode = patch(modal, this.createVnode());
        } else {
            const backdrop = document.createElement('div');
            document.body.appendChild(backdrop);
            this.vnode = patch(backdrop, this.createVnode());
        }
        this.dialog = this.vnode.children[0].elm;
        this.vnode.elm.style.display = 'block';
        this.vnode.elm.style.opacity = 0.3;

        // 监听键盘事件，按Esc键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    updateRender() {
        this.vnode = patch(this.vnode, this.createVnode());
    }

    open() {
        if (!this.vnode) {
            this.initialRender();
        } else {
            this.updateRender();
        }
    }

    close() {
        if (this.dialog) {
            this.dialog.classList.remove('layer-anim-00');
            this.dialog.classList.add('layer-anim-close');
            this.vnode.elm.style.display = 'none';
            this.vnode.elm.style.opacity = 0;
        }
    }

    trigger(eventName) {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
        });
        this.vnode.elm.dispatchEvent(event);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = new Modal();
    document.getElementById('button').addEventListener('click', () => {
        modal.open();
    });

    modal.vnode.elm.addEventListener('modal-confirm', () => {
        console.log('模态框确定按钮被点击');
        // 这里可以添加具体的业务逻辑，比如提交表单等操作
    });

    modal.vnode.elm.addEventListener('modal-close', () => {
        console.log('模态框关闭按钮被点击或按Esc键关闭');
        // 这里可以添加相应的清理等业务逻辑
    });
});