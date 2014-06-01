<?php

class FsFtp {
	
	var $conn_id;
	
	public function connect( $ftp_server )
	{
		$this->conn_id = ftp_connect($ftp_server);
		ftp_set_option($this->conn_id, 0, 5);
	}
	
	public function login( $ftp_user, $ftp_pass )
	{
		$this->login_result = ftp_login($this->conn_id, $ftp_user, $ftp_pass);
		ftp_pasv($this->conn_id,true);
	}
	
	public function delete( $path )
	{
		return ftp_delete($this->conn_id, $path );
	}
	
	function ftp_mkdir_recusive( $path )
	{
        
        $parts = explode("/",$path);
        $return = true;
        $fullpath = "";
        
        foreach($parts as $part){
                if(empty($part)){
                        $fullpath .= "/";
                        continue;
                }
                $fullpath .= $part."/";
                
                
                if(@ftp_chdir($this->conn_id, $fullpath)){
                   ftp_chdir($this->conn_id, $fullpath);
                }else{
                        if(@ftp_mkdir($this->conn_id, $part)){
                                //ftp_chmod($this->conn_id, 0777, $part);
                                ftp_chdir($this->conn_id, $part);
                        }else{
                                $return = false;
                        }
                }
        }
        return $return;
    }

	
	public function upload( $remote_file, $file )
	{
		ftp_systype($this->conn_id);
		ftp_chdir($this->conn_id,'.');
		ftp_put($this->conn_id, $remote_file, $file, FTP_BINARY);
		ftp_chmod($this->conn_id, 0755, $remote_file);
	}
	
	public function close()
	{
		ftp_close($this->conn_id);
	}
}