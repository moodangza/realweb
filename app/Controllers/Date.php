<?php
namespace App\Controllers;


class Date extends BaseController
{
  public function DateThai($strDate)
	{
		$strYear = date("Y",strtotime($strDate))+543;
		$strMonth= date("n",strtotime($strDate));
		$strDay= date("j",strtotime($strDate));
	
		$strMonthCut = Array("","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.");
		$strMonthThai=$strMonthCut[$strMonth];
		return "$strDay $strMonthThai $strYear";
	}
	public function Dateinpicker($strDate)
	{	
		$strDate = explode("-",$strDate);
		
		$strshdate = $strDate[2].'/'.$strDate[1].'/'.$strDate[0];
		return "$strshdate";
  	
	}
	
}

?>