import React, { useState, useEffect }  from "react";
import { Link, useParams } from "react-router-dom";
import branchApi from "api/branchApi";


const BranchDetail = (id) => {
    // const [nameBranch, setNameBranch] = useState();
    // const [loading, setLoading] = useState(false);
    // const {id} = useParams();
    // useEffect(() => {
    //     const branch = branchApi.getBranchById(id);
    // },[])
    return <>
    <h1>Branch Detail</h1>
    </>
}
export default BranchDetail;