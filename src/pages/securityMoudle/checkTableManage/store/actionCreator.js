import * as actionTypes from './actionTypes';
import axios from 'axios';



/**
 * 更新显示列表
 * @param {每页条数} pageSize 
 * @param {当前页号} pageNum 
 */
export const getCheckTableList = (pageSize,pageNum) => {
    return (dispatch) => {
        axios.get(`api/checkTable/getList?pageSize=${pageSize}&pageNum=${pageNum}`).then(res=>{
            console.log(res)
            const data = res.data;
            if(data.status === 1) {  //返回成功
                dispatch(
                    changeCheckTalbeList(
                        data.data.list,
                        data.data.pageSize,
                        data.data.pageNum,
                        data.data.total
                    )
                )
            }else {

            }
        }).catch(error=>{
            console.log(error)
        })
    }
}


/**
 * 改变提交结果状态
 * @param {是否提交成功}} submitSuccess 
 */
export const changeSubmitSuccess = (submitSuccess)=> ({
    type: actionTypes.CHANGE_SUBMIT_SUCCESS,
    submitSuccess
});

/**
 * 
 * @param {table的数据列表} list 
 * @param {每页条数} pageSize 
 * @param {当前页号} pageNum 
 * @param {总记录条数} total 
 */
const changeCheckTalbeList = (list, pageSize, pageNum, total)=> ({
    type: actionTypes.CHANGE_CHECKTABLE_LIST,
    list,
    pageSize,
    pageNum,
    total
});

/**
 * 通过检查表id 得到检查表详情简单内容，用于修改
 * @param {检查表id} id 
 */
export const getCheckTableById = (id)=> {
    return (dispatch) => {
        axios.get('/api/checkTable/getContent').then(res=>{

        }).catch(error=>{

        });
    }
}

/**
 * 
 * @param {checktable 详情} checktable 
 */
const changeCheckTalbeDetail = (checktable)=>{

}