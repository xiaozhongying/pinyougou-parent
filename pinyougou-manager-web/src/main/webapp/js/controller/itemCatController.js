 //控制层 
app.controller('itemCatController' ,function($scope,$controller,itemCatService,typeTemplateService){	
	$controller('baseController',{$scope:$scope});//继承
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		itemCatService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		itemCatService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		itemCatService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=itemCatService.update( $scope.entity ); //修改  
		}else{
			$scope.entity.parentId=$scope.parentId;//赋予上级ID
			serviceObject=itemCatService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.findByParentId($scope.parentId);//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	$scope.selectIds=[];//选中的ID集合 
	//更新复选
	$scope.updateSelection = function($event, id) {		
		if($event.target.checked){//如果是被选中,则增加到数组
			$scope.selectIds.push( id);			
		}else{
			var idx = $scope.selectIds.indexOf(id);
            $scope.selectIds.splice(idx, 1);//删除 
		}
	}
	//批量删除 
	$scope.dele=function(){	
		//删除前校验
		itemCatService.check( $scope.selectIds ).success(
				function(response){
					if(response.success){
						//获取选中的复选框			
						itemCatService.dele( $scope.selectIds ).success(
							function(response){
								if(response.success){
									alert(response.message)
									$scope.findByParentId($scope.parentId);//重新加载
									$scope.selectIds=[];
								}						
							}		
						);	
					}else{
						alert(response.message);
					}				
				}
		);
			
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		itemCatService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	//记录上级id
	$scope.parentId=0;
	//根据上级分类ID查询列表
	$scope.findByParentId=function(parentId){
		$scope.parentId=parentId;
		$scope.selectIds=[];
		itemCatService.findByParentId(parentId).success(
			function(response){
				$scope.list=response;
			}			
		);
	}
	
	$scope.grade=1;//默认为1级
	$scope.setGrade=function(value){
		$scope.grade=value;
	}
	//读取列表
	$scope.selectList=function(p_entity){
		if($scope.grade==1){//如果为1级
			$scope.entity_1=null;	
			$scope.entity_2=null;
		}		
		if($scope.grade==2){//如果为2级
			$scope.entity_1=p_entity;	
			$scope.entity_2=null;
		}		
		if($scope.grade==3){//如果为3级
			$scope.entity_2=p_entity;		
		}		
		$scope.findByParentId(p_entity.id);	//查询此级下级列表
	}
	$scope.typeTemplateList={};//初始化模板列表
	$scope.findTypeTemplateList=function(){
		typeTemplateService.selectOptionList().success(
				function(response){
					$scope.typeTemplateList=response;
				}
		);	
	}
	
});	
