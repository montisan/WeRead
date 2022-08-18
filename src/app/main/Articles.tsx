import { Avatar, Divider, List, Skeleton, Input, Button } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatDate } from "../../utils/utils";
import { AppmsgType, searchArticles } from "./api";
import './Articles.less'


const { Search } = Input;


const Articles: React.FC<{ fakeid: string; articleLink: string; onChangeArticle: Function }> = (props) => {

    const { fakeid, articleLink, onChangeArticle } = props;

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<AppmsgType[]>([]);
    const [begin, setBegin] = useState(0);
    const [query, setQuery] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const loadData = (query: string, start: number) => {
        if (loading) {
            return;
        }

        setLoading(true);
        searchArticles({
            fakeid,
            query,
            begin: start,
            count: 10
        }).then((data) => {

            console.log(data)

            if (data.base_resp.ret !== 0) {
                return;
            }


            const li = start === 0 ? data.app_msg_list : list.concat(data.app_msg_list)
            setBegin(start+10);

            setList(li)
            setHasMore(data.app_msg_list.length !== 0);

        }).finally(() => {
            setLoading(false)
        })
    };

    const loadMoreData = () => {
        loadData(query, begin)
    };

    const onSearch = (value: string) => {
        setQuery(value);
        // loadData(value, 0)
    };


    useEffect(() => {
        // loadData(query, 0);

        setList([])
        setBegin(0)
        setHasMore(true)
        const scroller = document.querySelector('#scrollableArticles');
        if(scroller) {
            scroller.scrollTop = 0;
        }

        if (fakeid || query) {
            setLoading(true);
            searchArticles({
                fakeid,
                query,
                begin: 0,
                count: 10
            }).then((data) => {

                console.log(data)

                if (data.base_resp.ret !== 0) {
                    return;
                }


                const li = data.app_msg_list
                setBegin(10);

                setList(li)
                setHasMore(data.app_msg_list.length !== 0);

            }).finally(() => {
                setLoading(false)
            })
        }


    }, [fakeid, query]);

    return (
        <div className="articles">
            <Search
                placeholder="搜公众号文章"
                allowClear
                enterButton="搜索"
                onSearch={onSearch}
                loading={loading}
            />
            <div
                id="scrollableArticles"
                className="articles__list"
            >
                <InfiniteScroll
                    dataLength={list.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={loading ? <Skeleton avatar paragraph={{ rows: 1 }} active /> : <div style={{ textAlign: 'center' }}><Button onClick={loadMoreData} style={{ margin: 'auto' }}>加载更多</Button></div>}
                    endMessage={
                        <Divider plain>It is all, nothing more 🤐</Divider>
                    }
                    scrollableTarget="scrollableArticles"
                >
                    <List
                        dataSource={list}
                        loading={loading}
                        renderItem={(item, index) => (
                            <List.Item key={`${item.aid}${index}`} onClick={() => onChangeArticle(item.link)} className={articleLink === item.link ? 'actived' : ''}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.cover} />}
                                    title={
                                        <div dangerouslySetInnerHTML={{ __html: item.title }}></div>
                                    }
                                    description={<>
                                        <div>{formatDate(item.create_time * 1000)}</div>
                                        <div>{item.digest}</div>
                                    </>}
                                />
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default Articles;
