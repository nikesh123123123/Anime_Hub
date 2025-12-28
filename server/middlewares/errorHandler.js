const errorhandler =(err,req,res,next)=>{

   console.error(`error,${err.message}`)

   const statuscode= res.statusCode && res.statusCode!=200 ? res.statusCode :500 ;
   
   res.status(statuscode).json(
    {
        success:false,
        message:err.message|| "server error"
    }
   )
}

export  default errorhandler;