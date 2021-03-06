import React, { Component } from "react";
import {Breadcrumb } from "@icedesign/base"
import TimeUtil from '@/utils/TimeUtil';
import Header from "@/components/CellBlock/Header";
import DepartmentUtil from "@/utils/DepartmentUtil";



export default class CHeader extends Header {
    static defaultProps = {
        showExprot: 'Cell'
    }

    constructor(props) {
        super(props);
    }

/**
     * 导出URL
     */
    getExportUrl(){
        return  '/cell/exportWorkSummaryByShift'
    }

    //添加导出参数
    getExportingParam(param){
        if (param){
            return Object.assign(param, {type: this.props.type});
        }
    }

    /**
     * 导出的名称
     */
    getExportingName(departmentId, param){
        return '技术员异常处理';
    }

    /**
     * 面包屑
     */
    getBreadcrumb(){
        return (
            <Breadcrumb separator="/">
            <Breadcrumb.Item >人员分析</Breadcrumb.Item>
            <Breadcrumb.Item >技术员异常处理</Breadcrumb.Item>
        </Breadcrumb>
        );
    }
}
