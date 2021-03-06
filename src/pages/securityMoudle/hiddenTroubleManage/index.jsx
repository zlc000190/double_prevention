import React, { Component } from 'react';
import axios from 'axios';
import Qs from 'qs';
import { Table, Breadcrumb, Select, Divider, Tag, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionCreator } from './store';

const data = [
    {
        key: '1',
        id: '0001',
        checkPeople: '胡彦斌',
        checkedDep: '1号矿井',
        checkTime: '西湖区湖底公园1号',
        status: '未整改',
        isFile:true
    },
    {
      key: '2',
      id: '0005',
      checkPeople: '王羲之',
      checkedDep: '西区配电室',
      checkTime: '1998-02-12 6:00',
      status: '整改中'
    },
    {
      key: '3',
      id: '0007',
      checkPeople: '王羲之',
      checkedDep: '西区配电室',
      checkTime: '1998-02-12 6:00',
      status: '已整改'
    },
    {
      key: '2',
      id: '0112',
      checkPeople: '王羲之',
      checkedDep: '西区配电室',
      checkTime: '1998-02-12 6:00',
      status: '已逾期'
    },
];




class HiddenTroubleManage extends Component {

    constructor(props) {
        super(props);
        //state
        this.state={
            type: '', //select的隐患类型
        }


        //绑定this
        this.withDraw = this.withDraw.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);   //换页
    }
    

     /**
     * 撤回整改信息
     * @param {撤回} text 
     */
    withDraw(text) {
      Modal.confirm({
          title: '确定撤回该整改通知？',
          okText: 'Yes',
          okType: 'danger',
          okButtonProps: {
            disabled: false,
          },
          cancelText: 'No',
          onOk() {
            axios.get(`/api/input/withdrawHD?hiddenDangerId=${text.id}`).then(res=>{
                if(res.data.status === 1) {
                  message.success(res.data.message || '撤回成功！',2);
                  const {  pagenationProps } = this.props;  //属性
                  this.handleChangePage(pagenationProps.get('current'),pagenationProps.get('pageSize'));
                }else {
                  message.error(res.data.message || '撤回失败！',2);
                }
            }).catch(error=> {
              message.error(error.message,2);
            });
             //这里删除item
          }
        });
    }

    /**
     * 
     * @param {*} pageNum 
     * @param {*} pageSize 
     */
    handleChangePage(pageNum,pageSize) {
        this.props.getTableList(this.state.type, pageSize, pageNum);
    }


    render() { 
        const { getTableList } = this.props;    //方法
        const { tableList, pagenationProps } = this.props;  //属性
        const JStableList = tableList.toJS();
        const JSpagenationProps = pagenationProps.toJS();
        JSpagenationProps.onChange = this.handleChangePage;
        JSpagenationProps.onShowSizeChange = this.handleChangePage;

      const columns = [
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          },
          {
            title: '隐患分类',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
          },
          {
            title: '是否归档',
            dataIndex: 'isFile',
            key: 'isFile',
            render:(text)=>{return text?<span>是</span>:<span>否</span>}
          },
          {
            title: '操作',
            key: 'action',
            render: (text,value)=>(<span>
                <Link to={`/main/hiddentTrouble/manage/detail/${text.id}`}><Tag color="blue">详情</Tag></Link>
                { value.status === '未整改' ? (
                    <span><Divider type="vertical" />
                        <Link to={`/main/hiddentTrouble/manage/toRectify/${text.id}`}><Tag>下发整改</Tag></Link>
                    </span>) : (null) 
                }
                {
                  value.status === '整改中' ? (
                    <span><Divider type="vertical" />
                    <Link to={`/main/hiddentTrouble/manage/rectify/${text.id}`}><Tag>整改完成</Tag></Link>
                    </span>) : (null) 
                }
                
                {
                  value.status === '整改中' || value.status === '已逾期' ? (
                    <span><Divider type="vertical" />
                        <Tag color="red" 
                          onClick={()=>{
                             this.withDraw(value);
                          }}>
                          撤回
                        </Tag>
                    </span>) : (null) 
                }
            </span>)
          }
        ];

        return (
            <div className="page">
               {/* 导航路径 */}
               <Breadcrumb className="path">
                    <Breadcrumb.Item>安全检查与隐患管理</Breadcrumb.Item>
                    <Breadcrumb.Item>隐患整改信息</Breadcrumb.Item>
                </Breadcrumb>
                {/* 内容区域 */}
                <div className="contentWrap">
                <div style={{width:'90%',margin:'20px auto',height:'80px'}}>
                        <Select
                            size="large"
                            style={{ width: 200, display:"inline-block",margin: "20px 0" }}
                            placeholder="Select a checktable"
                            onChange={(value,e)=>{
                                this.setState({
                                    type: value //将选中的类型存储起来
                                })
                                getTableList(value,5,1)
                            }}
                        >
                            <Select.Option value="未整改">未整改</Select.Option>
                            <Select.Option value="整改中">整改中</Select.Option>
                            <Select.Option value="已整改">已整改</Select.Option>
                            <Select.Option value="已逾期">已逾期</Select.Option>
                        </Select>   
                        {/* <Search
                            className="searchClass"
                            placeholder="input search text"
                            enterButton="Search"
                            onSearch={value => console.log(value)}
                        /> */}
                    </div>
                    <Table className="tableClass" bordered={true} columns={columns} dataSource={JStableList} pagination={JSpagenationProps} />
                </div>
            </div>
        )
    }
}




//将 store 数据传给组件props
const mapState = (state)=> {
  return {
    tableList: state.getIn(['hiddenTrouble','tableList']),
    pagenationProps: state.getIn(['hiddenTrouble','pagenationProps'])
  }
};

//将操作store的方法传给组件props
const mapDispatch = (dispatch)=> {
  return {
    
      getTableList(status,pageSize,current){
          dispatch(actionCreator.getTableList(status,pageSize,current));
      }
  }
};

export default connect(mapState,mapDispatch)(HiddenTroubleManage);