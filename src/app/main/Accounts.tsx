import { Avatar, Divider, List, Skeleton, Input } from "antd";
import React, { useEffect, useState } from "react";
import { AccountType, searchAccounts } from "./api";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Accounts.less";

const { Search } = Input;

const Accounts: React.FC<{fakeid: string; onChangeFakeid: Function}> = (props) => {

    const {fakeid, onChangeFakeid} = props;
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<AccountType[]>([]);
    const [begin, setBegin] = useState(0);
    const [query, setQuery] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const loadData = (query:string, start: number) => {
        if (loading) {
            return;
        }

        setLoading(true);
        searchAccounts({
            query,
            begin: start,
            count: 10
        }).then((data) => {

            console.log(data)

            if(data.base_resp.ret !== 0) {
                return;
            }

            const li = start===0?data.list:list.concat(data.list)

            setBegin(li.length);

            setList(li)
            setHasMore(data.list.length!==0);

        }).finally(() => {
            setLoading(false)
        })
    };

    const loadMoreData = () => {
        loadData(query, begin)
    };



    const onSearch = (value: string) => {
        setQuery(value);
        loadData(value, 0)
        const scroller = document.querySelector('#scrollableDiv');
        if(scroller) {
            scroller.scrollTop = 0;
        }
    };

    useEffect(() => {
    }, []);

    return (
        <div className="accounts">
            <Search
                placeholder="搜公众号"
                allowClear
                enterButton="搜索"
                loading={loading}
                onSearch={onSearch}
            />
            <div id="scrollableDiv" className="accounts__list">
                <InfiniteScroll
                    dataLength={list.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={loading && <Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={
                        <Divider plain>It is all, nothing more 🤐</Divider>
                    }
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        dataSource={list}
                        loading={loading}
                        renderItem={(item) => (
                            <List.Item key={item.fakeid} onClick={()=>onChangeFakeid(item.fakeid)} className={fakeid===item.fakeid?'actived':''}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.round_head_img} />}
                                    title={
                                        <div dangerouslySetInnerHTML={{__html: item.nickname.replace(new RegExp(query, "g"), `<span class="mark">${query}</span>`)}}></div>
                                    }
                                    description={item.signature}
                                />
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default Accounts;
