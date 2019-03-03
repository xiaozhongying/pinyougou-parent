package com.pinyougou.shop.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import entity.Result;
import util.FastDFSClient;

/**
 * 文件上传
 * @author Administrator
 *
 */
@RestController
public class UploadController {
	
	@Value("${FILE_SERVER_URL}")
	private String FILE_SERVER_URL;//文件服务其地址
	
	@RequestMapping("/upload")
	public Result upload(MultipartFile file){
		//获取文件的扩展名
		String originalFilename=file.getOriginalFilename();
		String extName=originalFilename.substring(originalFilename.indexOf(".")+1);
		try{
			//创建一个fastDFS客户端
			FastDFSClient fastDFSClient=new FastDFSClient("classpath:config/fdfs_client.conf");
			//执行上传处理
			String path=fastDFSClient.uploadFile(file.getBytes(),extName);
			//拼接返回的url和ip地址，获得完整的url、
			String url=FILE_SERVER_URL+path;
			System.out.println(extName);
			return new Result(true,url);
			
		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return new Result(false, "上传失败");
		}
	}
	
}
