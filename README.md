# OneDrive DavFS Cookies reporting tool

If you want to mount a OneDrive directory using DavFS, you might need to
keep the cookies up to date.

This is an extension to help you do that. To use it:

* Install the extension.
* Navigate to any OneDrive directory in the browser
* Click the "cookie" icon in the address bar
* Copy the resulting line to your `/etc/davfs/dsvfs.conf` file
* Mount the drive.

You will know when it's time to do it again when mounting fails with
`403 FORBIDDEN`.

This is what it looks like:

![Screenshot of cookie collector pop-up][screenshot]

## How to use the cookies

You need the following OneDrive details:

* `USERNAME`: Your OneDrive username, e.g. `bob`
* `PASSWORD`: Your OneDrive password, e.g. `hunter2`
* `DOMAIN`: The Sharepoint URL, e.g. `https://company-my.sharepoint.com/personal/bob_company_com/Documents` (might vary depending on the service)

And the following details on your own system:

* `MOUNTPOINT`: Where you want to mount the OneDrive drive
* `USER`: the username on your system that should own these files

### Setting up a system-wide mount

Add a line in `/etc/fstab`:

    https://DOMAIN.sharepoint.com/personal/USERNAME_DOMAIN/Documents MOUNTPOINT davfs rw,user,uid=USER,noauto 0 0 

Add you OneDrive credentials in the "credential line" section of
`/etc/davfs/secrets`:

`https://DOMAIN.sharepoint.com/personal/USERNAME_DOMAIN/Documents USERNAME PASSWORD`

Add the cookies to `/etc/davfs/davfs.conf`. The last line is what this extension
gives you.

```
use_locks 0 
[MOUNTPOINT] 
add_header Cookie rtFa=FTFA_COOKIE;FedAuth=FEDAUTH_COOKIE 
```

Other links:

* [Mount OneDrive for Business on Headless Linux VPS through WebDav](mount_one_drive_linux_vps)

## Developing

You can load the exension in Firefox via `about:debugging`.

To package it, use `make xpi`.

[mount_one_drive_linux_vps]: https://shui.azurewebsites.net/2018/01/13/mount-onedrive-for-business-on-headless-linux-vps-through-webdav/

[screenshot]: docs/davfs_cookie_screenshot.png