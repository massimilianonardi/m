#NoTrayIcon
#SingleInstance force

RunWait, reg import %A_ScriptDir%\7-Zip-registry-00-defaults.reg,, Hide
RunWait, reg import %A_ScriptDir%\7-Zip-registry-01-settings.reg,, Hide

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

EnvGet, sysarch, ProgramFiles(x86)
RunWait, "%A_ScriptDir%\7zFM.exe" %params%
RunWait, reg import %A_ScriptDir%\7-Zip-registry-02-clear-history.reg,, Hide
if(sysarch = "")
{
  RunWait, reg export HKCU\Software\7-Zip %A_ScriptDir%\7-Zip-registry-01-settings.reg,, Hide
}
else
{
  RunWait, reg export HKCU\Software\7-Zip %A_ScriptDir%\7-Zip-registry-01-settings.reg /y,, Hide
}
RunWait, reg import %A_ScriptDir%\7-Zip-registry-03-clear-settings.reg,, Hide

ExitApp
