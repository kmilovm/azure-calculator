(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{6771:function(){},8022:function(){},6045:function(){},8190:function(){},7333:function(){},6139:function(){},5665:function(e,t,n){Promise.resolve().then(n.bind(n,5560))},5560:function(e,t,n){"use strict";n.r(t);var r=n(7437),a=n(2265),l=n(4272),s=n(9139),o=n(8738),i=n(5996),c=n(6285),u=n(9835),d=n(9501),p=n(8008),h=n(7002),f=n(3206),m=n(8416);t.default=()=>{let[e,t]=(0,a.useState)(0),[n,b]=(0,a.useState)(0),[x,g]=(0,a.useState)("add"),[y,j]=(0,a.useState)(null),[v,w]=(0,a.useState)();(0,a.useEffect)(()=>{v||(async()=>{await k("https://azcalcfuncapp.azurewebsites.net/api/Negotiate?Code=xalq08ep4DFku4cVqnDo7kskGMcUAU0nI/VV/bfrnAM=",w)})()},[]),(0,a.useEffect)(()=>{if(v){let e=new d.s().withUrl(v.url,{accessTokenFactory:()=>v.accessToken}).configureLogging(p.i.Debug).build();e.on("ReceiveMessage",e=>{j(e)}),e.start().catch(e=>console.error(e.toString()))}},[v]);let C=async()=>{j("Sending operation to server, please wait!"),await fetch("https://azcalcfuncapp.azurewebsites.net/api/Calculate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:"calculator",num1:e,num2:n,operation:x})}).then(e=>{}).catch(e=>{throw Error("HTTP error! status: ".concat(e))})};async function k(e,t){await fetch(e,{method:"POST",headers:{"x-ms-client-principal-id":"Calculate"}}).then(e=>{e.json().then(e=>{t(e)})}).catch(e=>{throw console.log("error",e),Error("HTTP error! status: ".concat(e))})}return(0,r.jsx)(l.Z,{display:"flex",justifyContent:"center",alignItems:"center",style:{minHeight:"100vh"},children:(0,r.jsxs)(s.Z,{sx:{minWidth:275},children:[(0,r.jsx)(h.Z,{action:(0,r.jsx)(f.Z,{"aria-label":"settings"}),title:"Welcome to Azure Calculator",subheader:"Please use the wheel or arrows to select the numbers and the operation and press calculate button"}),(0,r.jsx)(m.Z,{}),(0,r.jsx)(i.Z,{children:(0,r.jsxs)(l.Z,{sx:{display:"flex",m:1,p:1,bgcolor:e=>"dark"===e.palette.mode?"#101010":"#fff",color:e=>"dark"===e.palette.mode?"grey.300":"grey.800",border:"1px solid",borderColor:e=>"dark"===e.palette.mode?"grey.800":"grey.300",borderRadius:2,fontSize:"0.875rem",fontWeight:"700"},children:[(0,r.jsx)("input",{type:"number",title:"number1",placeholder:"Enter number 1",className:"w-full p-2 mb-2 border rounded text-center",value:e,onKeyPress:e=>{e.preventDefault()},onPaste:e=>{e.preventDefault()},onChange:e=>t(Number(e.target.value))}),(0,r.jsxs)("select",{title:"operation",className:"w-full p-2 mb-2 border rounded",value:x,onChange:e=>g(e.target.value),children:[(0,r.jsx)("option",{value:"add",children:"Add"}),(0,r.jsx)("option",{value:"subtract",children:"Subtract"}),(0,r.jsx)("option",{value:"multiply",children:"Multiply"}),(0,r.jsx)("option",{value:"divide",children:"Divide"})]}),(0,r.jsx)("input",{type:"number",title:"number2",placeholder:"Enter number 2",className:"w-full p-2 mb-2 border rounded text-center",value:n,onKeyPress:e=>{e.preventDefault()},onPaste:e=>{e.preventDefault()},onChange:e=>b(Number(e.target.value))})]})}),(0,r.jsx)(o.Z,{children:(0,r.jsx)(l.Z,{display:"flex",justifyContent:"left",alignItems:"left",children:(0,r.jsx)(c.Z,{size:"small",onClick:C,children:"Calculate"})})}),(0,r.jsx)(l.Z,{display:"flex",justifyContent:"center",alignItems:"center",children:(0,r.jsxs)(u.Z,{sx:{fontSize:16},color:"text.secondary",gutterBottom:!0,children:["Resultant: ",(0,r.jsx)("b",{children:null!=y?y:"Not computed yet"})]})})]})})}}},function(e){e.O(0,[729,971,69,744],function(){return e(e.s=5665)}),_N_E=e.O()}]);