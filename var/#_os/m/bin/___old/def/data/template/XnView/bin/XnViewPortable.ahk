#NoTrayIcon
#SingleInstance force

SetWorkingDir, %A_ScriptDir%

params := ""
Loop, %0%
{
  param := %A_Index%
  if param contains %A_Space%
  {
    param = "%param%"
  }
  params = %params% %A_Space% %param%
}
;cmdline := dllCall("GetCommandLineA",str) 

RunWait, "%A_ScriptDir%\xnview.exe" %params%

RunWait, XnViewPortable.bat,,Hide

ExitApp
