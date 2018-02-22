#!/bin/bash
echo "Test Build"
testDir="/cygdrive/c/$1"
albumName="$2"
targetPath=${testDir}/${albumName}

echo "testDir=${testDir}"
echo "albumName=${albumName}"
echo "targetPath=${targetPath}"


# clear out old stuff first
if [[ -d "${targetPath}/webpage" ]]
then
   # from https://stackoverflow.com/questions/1885525/how-do-i-prompt-a-user-for-confirmation-in-bash-script 
   echo "going to remove :${targetPath}/webpage:"
   read -p "OK to remove? [Y|N] " -n 1 -r
   echo    # (optional) move to a new line
   if [[ ! $REPLY =~ ^[Yy]$ ]]
   then
      # handle exits from shell or function but don't exit interactive shell
      [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 
   fi
   rm -rf ${targetPath}/webpage
   echo "removed existing webpage"
fi

mkdir ${targetPath}/webpage

# copy files and directories, skipping administrative files
find . -print | egrep -v '*.swp|*.vim|*.sh' | cpio -puvd ${targetPath}/webpage

echo "webpage copied"

# now edit the index.html page to specify the JSON data file
sed -i "s/ALBUMFILENAME/${albumName}/g" ${targetPath}/webpage/index.html
