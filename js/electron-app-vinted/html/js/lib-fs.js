
//------------------------------------------------------------------------------

function mkdir(dir)
{
  if(!fs.existsSync(dir))
  {
    fs.mkdirSync(dir, {recursive: true});
  }
}

//------------------------------------------------------------------------------

function lsdir(dir, followLinks)
{
  var list = [];

  fs.readdirSync(dir, {recursive: true}).forEach(file =>
  {
    var filePath = path.join(dir, file);
    var stat = fs.lstatSync(filePath);
    if(stat.isDirectory())
    {
      if(stat.isSymbolicLink())
      {
        if(followLinks === true) list.push(file);
      }
      else list.push(file);
    }
  });

  return list;
}

//------------------------------------------------------------------------------

function lspath(dir, absolute)
{
  var list = fs.readdirSync(dir, {recursive: true});

  var root = dir;
  if(absolute === true) root = path.resolve(dir);

  for(var i = 0; i < list.length; i++)
  {
    list[i] = path.join(root, list[i]);
  }

  return list;
}

//------------------------------------------------------------------------------
