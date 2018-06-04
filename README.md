# OneDrive DavFS Cookies reporting tool

If you want to mount a OneDrive directory using DavFS, you might need to
keep the cookies up to date.

This is an extension to help you do that. To use it:

* Install the extension.
  * From the [Firefox Addon page][amo_link]
  * From an XPI at [Github releases][github_releases]
  * Building yourself and install in `about:debugging`. See the "Developing"
    section below.
* Navigate to any OneDrive directory in the browser
* Click the "cookie" icon in the address bar
* Copy the resulting line to your `/etc/davfs2/dsvfs2.conf` file
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

You will also need to install `davfs2` using your package manager of choice.

### Setting up a system-wide mount

Add a line in `/etc/fstab`:

    https://DOMAIN.sharepoint.com/personal/USERNAME_DOMAIN/Documents MOUNTPOINT davfs rw,user,uid=USER,noauto 0 0 

You can also mount with systemd, see [the Arch wiki][arch_wiki_davfs2]. This
allows deferring the mount until the network is ready (which is the reason for
`noauto` above).

Add your OneDrive credentials in the "credential line" section of
`/etc/davfs2/secrets`:

`https://DOMAIN.sharepoint.com/personal/USERNAME_DOMAIN/Documents USERNAME PASSWORD`

Make sure this file can't be read by others: 
`chmod 600 /etc/davfs2/secrets && chown root:root /etc/davfs2/secrets`.
This should already be true, but it won't hurt to check!

Add the cookies to `/etc/davfs2/davfs2.conf`. The last line is what this extension
gives you. The cookies are rather long and look like base64 encoded data.

```
use_locks 0 
[MOUNTPOINT] 
add_header Cookie rtFa=FTFA_COOKIE;FedAuth=FEDAUTH_COOKIE 
```

### Setting up a user-only mount

This is useful if you don't have admin access, or share the machine, but
don't want to share the OneDrive access credentials.

Exactly as above, but you use the files `~/.davfs2/davfs2.conf` 
and `~/.davfs2/secrets` instead of the ones in `/etc`. You probably will need
to create the directory `/.davfs2`.

Remember to `chmod 600 ~/.davfs/secrets`.

As far as I know, you do still need either the entry in `/etc/fstab` or the 
systemd unit, so you still need root's support. Let me know if it's 
possible to do this entirely as a normal user!

### Other links

* [Arch Wiki: Davfs2][arch_wiki_davfs2]
* [Mount OneDrive for Business on Headless Linux VPS through WebDav][mount_one_drive_linux_vps]

## Developing

You can load the exension in Firefox via `about:debugging`.

To package it, use `make xpi`.

[amo_link]: https://addons.mozilla.org/en-US/firefox/addon/onedrive-davfs-cookie-finder
[github_releases]: https://github.com/johnbeard/onedrive_davfs_cookie_ext/releases

[arch_wiki_davfs2]: https://wiki.archlinux.org/index.php/Davfs2#Mount_WebDAV-resource
[mount_one_drive_linux_vps]: https://shui.azurewebsites.net/2018/01/13/mount-onedrive-for-business-on-headless-linux-vps-through-webdav/

[screenshot]: docs/davfs_cookie_screenshot.png