import React, { Component } from "react";
import { Button, Field, DatePicker, Select, Breadcrumb } from "@icedesign/base"
import TimeUtil from '@/utils/TimeUtil';
import Header from "@/components/CellBlock/Header";
import DepartmentUtil from "@/utils/DepartmentUtil";

export default class CHeader extends Header {
    static defaultProps = {
        showExprot: 'block'
    }

    constructor(props) {
        super(props);
    }

     /**
     * 导出URL
     */
    getExportUrl(){
        return  '/block/exportBlockWorkSummaryByShift';
    }

    /**
     * 导出的名称
     */
    getExportingName(){
        return 'OP上下料/待机';
    }

    /**
     * 面包屑
     */
    getBreadcrumb(){
        return (
            <Breadcrumb separator="/">
            <Breadcrumb.Item >人员分析</Breadcrumb.Item>
            <Breadcrumb.Item >OP待机换料</Breadcrumb.Item>
        </Breadcrumb>
        );
    }
}
