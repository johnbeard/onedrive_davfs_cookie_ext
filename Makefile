XPI:="onedrive_davfs_cookie.xpi"

.PHONY: all clean xpi $(XPI)

all: xpi

xpi: $(XPI)

clean:
	rm -f $(XPI)

$(XPI):
	@echo "Building $@"
	rm -f $(XPI)
	zip -r $(XPI) * -x '*.xpi' -x 'Makefile' -x 'docs/*' -x 'README.md'