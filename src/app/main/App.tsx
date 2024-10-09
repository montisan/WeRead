import React, { Component } from "react";
import "./App.less";
import Account from "./Accounts";
import Articles from "./Articles";
import { getArticleHTML } from "./api";
import { Spin } from "antd";

let openedWindow: Window | null = null;

export default class App extends Component<
    {},
    {
        fakeid: string;
        articleLink: string;
        articleHtml: string;
        articleLoading: boolean;
    }
> {
    constructor(props: any) {
        super(props);
        this.state = {
            fakeid: "",
            articleLink: "",
            articleHtml: "",
            articleLoading: false,
        };
    }

    onChangeFakeid = (fakeid: string) => {
        this.setState({
            fakeid,
        });
    };
    onChangeArticle = (link: string) => {
        this.setState({
            articleLink: link,
            articleLoading: true,
        });

        getArticleHTML({ link }).then((value) => {
            console.log(value);
            const { articleLink } = this.state;
            if (value.link === articleLink) {
                if (value.html) {
                    const html = value.html
                        .replace(/data-src/g, "src")
                        .replace("visibility: hidden;", "")
                        .replace("opacity: 0;", "");
                    // const src = `data:text/html;charset=utf-8,${html}`;
                    this.setState({
                        articleHtml: html,
                    });

                    const scroller = document.querySelector("#scrollerArticle");
                    if (scroller) {
                        scroller.scrollTop = 0;
                    }
                }

                this.setState({
                    articleLoading: false,
                });
            }
        });

        // if(!openedWindow || openedWindow.closed) {
        //     const features = "height=900, width=500, toolbar=no, menubar=no, scrollbars=no,resizable=no, location=no, status=no";
        //     openedWindow = window.open(link, 'newWindow', features)

        //     if(openedWindow) {
        //         openedWindow.onload = () => {
        //             console.log(openedWindow?.document)
        //         }
        //     }

        // } else {
        //     openedWindow.location.href = link;
        //     openedWindow.focus();
        // }
    };
    componentDidMount() {}
    render() {
        const { fakeid, articleLink, articleHtml, articleLoading } = this.state;
        return (
            <div className="app">
                <Account fakeid={fakeid} onChangeFakeid={this.onChangeFakeid} />
                <Articles
                    fakeid={fakeid}
                    articleLink={articleLink}
                    onChangeArticle={this.onChangeArticle}
                />
                <div className="app__article" id="scrollerArticle">
                    <Spin tip="Loading..." spinning={articleLoading}>
                        <div
                            dangerouslySetInnerHTML={{ __html: articleHtml }}
                        ></div>
                    </Spin>
                </div>
            </div>
        );
    }
}
