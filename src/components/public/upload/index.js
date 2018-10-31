import React from 'react';
import ReactDOM from 'react-dom';
import {Notification} from '../../antd_extension';
import {Modal}  from 'antd';
import _ from 'lodash';
import BaseComponent from '../../BaseComponent';
import {SETTINGS} from '../../../lib/settings';
import * as plupload from 'plupload';
import './index.css';

export default class UploadPic extends BaseComponent {
    constructor (props) {
        super(props);
        this.state = {
            isError: false,
            fileList: [],
            file: '',
            previewVisible: false,
            previewImage: '',
        };
        this.bindCtx(
            'randomString',
            'getMobileSrc',
            'calculateObjectName',
            'getUploadedObjectName',
            'getSuffix',
            'setUploadParam',
            'newUploader'
        )
    }

    randomString (len) {
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        const maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    getMobileSrc (src, mobile = false) {
        let {bucket, region, dir} =this.props;
        let imgSrc = `http://${bucket}.${region}.aliyuncs.com/${dir + src}`;
        if (mobile) {
            imgSrc += '@!mobile2';
            imgSrc = imgSrc.replace(/.oss/, '.img');
        }
        return imgSrc;
    }

    calculateObjectName (filename) {
        if (this.props.localName) {
            return this.key + `${filename}`;
        } else {
            return this.key + this.randomString(10) + this.suffix;
        }
    }

    getUploadedObjectName (filename, showDir) {
        let rFileName = '';
        if (this.props.localName) {
            rFileName = this.tempKey.replace(`${filename}`, filename);
        } else {
            rFileName = this.tempKey;
        }
        if (!showDir) {
            const pos = rFileName.lastIndexOf('/');
            if (pos !== -1) {
                rFileName = rFileName.substring(pos + 1);
            }
        }
        return rFileName;
    }

    getSuffix (filename) {
        const pos = filename.lastIndexOf('.');
        let suffix = '';
        if (pos !== -1) {
            suffix = filename.substring(pos);
        }
        return suffix;
    }

    setUploadParam (up, filename) {
        this.tempKey = this.key;
        if (filename !== '') {
            this.suffix = this.getSuffix(filename);
            this.tempKey = this.calculateObjectName(filename);
        }
        if (!this.props.suffix) {
            const pos = this.tempKey.lastIndexOf('.');
            if (pos !== -1) {
                this.tempKey = this.tempKey.substring(0, pos);
            }
        }
        if (!this.state.isError) {
            const new_multipart_params = {
                'x-oss-meta-name': this.props.name,
                'x-oss-meta-token': this.props.token,
                'key': this.tempKey,
                'policy': this.policy,
                'OSSAccessKeyId': this.accessid,
                'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                'signature': this.signature,
            };
            up.setOption({
                'url': this.host,
                'multipart_params': new_multipart_params
            });
            up.start();
        }
    }

    newUploader () {
        const browseButton = ReactDOM.findDOMNode(this.refs.selectfiles);
        const container = ReactDOM.findDOMNode(this.refs.uploadContainer);
        const ossfile = ReactDOM.findDOMNode(this.refs.ossfile);
        const extensions = this.props.extensions;
        const max_file_size = `${this.props.maxSize}mb`;
        const that = this;

        const PostInit = (up)=> {
            browseButton.onclick = (e)=> {
                e.preventDefault();
                this.callbackFileArray = [];
                const tempFiles = up.files;
                const len = tempFiles.length;
                for (let i = len - 1; i >= 0; i--) {
                    up.removeFile(tempFiles[i]);
                }
                if (that.props.uploadClickReset) {
                    if (that.props.extra) {
                        that.props.uploadClickReset(that.props.extra);
                    } else {
                        that.props.uploadClickReset();
                    }
                }
            };
            // if (!that.props.autoStart) {
            //     const postfiles = ReactDOM.findDOMNode(this.refs.postfiles);
            //     postfiles.onclick = (e)=> {
            //         e.preventDefault();
            //         that.setUploadParam(up, '');
            //         return false;
            //     };
            // }
        };
        const FilesAdded = (up, files) => {
            if (that.props.autoStart && up.files) {
                that.setUploadParam(up, '');
            }
            plupload.each(files, function (file) {
                ossfile.innerHTML +=
                    '<div id="' + file.id + '">' + plupload.formatSize(file.size) + ' - <b></b>'
                    + '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                    + '</div>';
            });
        };
        const BeforeUpload = (up, file) => {
            that.setUploadParam(up, file.name);
        };
        const UploadProgress = (up, file) => {
            const d = document.getElementById(file.id);
            if (d) {
                d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                const prog = d.getElementsByTagName('div')[0];
                const progBar = prog.getElementsByTagName('div')[0];
                progBar.style.width = file.percent + '%';
                progBar.setAttribute('aria-valuenow', file.percent);
            }
        };

        const FileUploaded = (up, files, info) => {
            if (info.status === 200) {
                const rname = that.getUploadedObjectName(files.name, that.props.rdir);
                that.callbackFileArray.push(rname);
                const realName = that.getUploadedObjectName(files.name, true);
                Notification.success(`源文件名：${files.name}(${(files.size / 1024).toFixed()}kb)\n 上传后OSS文件名称:${realName}`,
                    '文件上传成功');
                let {fileList, file} = that.state;
                let {multiple} = that.props;
                if (multiple) {
                    fileList.push(rname);
                } else {
                    file = rname;
                }
                that.setState({fileList, file});
            } else {
                Notification.error(info.response);
                that.setState({isError: true});
            }
            that.tempKey = '';
        };
        const UploadComplete = () => {
            let {fileList, file} = that.state;
            let {multiple, extra:{fieldName}} = that.props;
            if (multiple) {
                that.props.eachCallback({[fieldName]: fileList});
            } else {
                that.props.eachCallback({[fieldName]: file});
            }
            if (typeof that.props.callback === 'function') {
                that.props.callback(that.callbackFileArray);
            }
        };
        const FileFiltered = (up, file) => {
            if (that.props.filter && !that.props.filter.test(file.name)) {
                Notification.error(`${file.name}文件名格式不符合规范`);
                that.setState({isError: true});
            }
        };
        const FilesRemoved = (up, files) => {
            plupload.each(files, function (file) {
                const node = document.getElementById(file.id);
                if (node) {
                    ossfile.removeChild(node);
                }
            });
        };
        const Error = (up, err) => {
            if (err.code === -600) {
                Notification.error("\n选择的文件太大了,当前上传的最大大小为:" + that.props.maxSize + "mb", '文件上传失败!');
            } else if (err.code === -601) {
                Notification.error("\n选择的文件后缀不对,可以根据应用情况，当前可允许的上传文件类型为:" + that.props.extensions);
            } else if (err.code === -602) {
                Notification.error('该文件已经上传');
            } else {
                Notification.error(err.response);
            }
            that.tempKey = '';
            console.log(err);
            that.setState({isError: true});
        };
        this.uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: browseButton,
            multi_selection: this.props.multiple,
            container,
            url: 'http://oss.aliyuncs.com',
            filters: {
                //默认只允许上传图片
                mime_types: [
                    {title: "files", extensions},
                ],
                //默认最大只能上传20mb的文件
                max_file_size,
                prevent_duplicates: true //不允许选取重复文件
            },
            init: {
                PostInit,
                FilesAdded,
                BeforeUpload,
                FilesRemoved,
                UploadProgress,
                FileUploaded,
                UploadComplete,
                FileFiltered,
                Error
            }
        });
        this.uploader.init();
    }

    uploadSignature (bucket, region) {
        fetch(SETTINGS.RESTFUL_URL.noAuthCheck + 'upload/getSignature', {
            method: 'POST',
            headers: {"Content-Type": "application/json", 'Accept': 'application/json'},
            mode: "cors",
            body: JSON.stringify({
                bucket,
                region
            })
        }).then(response => response.json())
            .then(data => {
                let result = data.info;
                if (data.info) {
                    this.accessid = result.accessid;
                    this.expire = result.expire;
                    this.host = result.host; //'http://unibox-img.oss-cn-beijing.aliyuncs.com/';
                    this.key = this.props.dir;
                    this.policy = result.policy;
                    this.signature = result.signature;
                    this.newUploader();
                }
            });
    }

    componentDidMount () {
        let {bucket, region} = this.props;
        this.uploadSignature(bucket, region);
    }

    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = (file) => {
        this.setState({
            previewImage: file,
            previewVisible: true,
        });
    };

    removeItem (index) {
        let {fileList, file} = this.state;
        let {multiple, extra:{fieldName}} = this.props;
        if (multiple) {
            _.pullAt(fileList, index);
            this.setState({fileList});
            this.props.eachCallback({[fieldName]: fileList});
        } else {
            file = '';
            this.setState({file});
            this.props.eachCallback({[fieldName]: file});
        }
    }

    renderItem () {

        const {fileList, file} = this.state;
        let {multiple, btnName} = this.props;

        const uploadButton = (
            <span tabIndex="0" className="ant-upload" role="button">
                <input type="file" accept="" style={{"display": "none"}}/>
                <div>
                    <i className="anticon anticon-plus"> </i>
                    <div className="ant-upload-text">{btnName}</div>
                </div>
                <div ref="ossfile"></div>
            </span>
        );

        if (multiple) {
            return (
                <div>
                    {
                        fileList && fileList.length ? fileList.map((img, index)=> {
                            img = this.getMobileSrc(img, true);
                            return (
                                <div className="ant-upload-list ant-upload-list-picture-card"
                                    key={`upload_${index}`}>
                                    <div className="ant-upload-list-item ant-upload-list-item-done"
                                        style={{width: '96px', height: '96px', padding: 2}}>
                                        <div className="ant-upload-list-item-info">
                                            <img src={img} alt="xxx.png"
                                                style={{width: '100%', height: '100%'}}/>
                                        </div>
                                        <span className="ant-upload-list-item-actions">
                                            <a onClick={()=> {
                                                this.handlePreview(img)
                                            }}
                                                rel="noopener noreferrer" title="Preview file">
                                            <i className="anticon anticon-eye-o"> </i>
                                            </a>
                                            <i title="Remove file" className="anticon anticon-delete"
                                                onClick={()=> {
                                                    this.removeItem(index)
                                                }}> </i>
                                        </span>
                                    </div>
                                </div>
                            )
                        }) : null
                    }
                    <div ref="uploadContainer">
                        <div ref="selectfiles"
                            className="ant-upload ant-upload-select ant-upload-select-picture-card">
                            <div ref="postfiles"></div>
                            {uploadButton}
                        </div>
                    </div>
                </div>
            )

        } else {
            let imgFile = this.getMobileSrc(file, true);
            return (
                <div>
                    {file ? <div className="ant-upload-list ant-upload-list-picture-card">
                        <div className="ant-upload-list-item ant-upload-list-item-done"
                            style={{width: '96px', height: '96px', padding: 2}}>
                            <div className="ant-upload-list-item-info">
                                <img src={imgFile} alt="xxx.png"
                                    style={{width: '100%', height: '100%'}}/>
                            </div>
                            <span className="ant-upload-list-item-actions">
                                <a onClick={()=> {
                                    this.handlePreview(imgFile)
                                }}
                                    rel="noopener noreferrer" title="Preview file">
                                    <i className="anticon anticon-eye-o"> </i>
                                </a>
                                <i title="Remove file" className="anticon anticon-delete"
                                    onClick={()=> {
                                        this.removeItem()
                                    }}> </i>
                            </span>
                        </div>
                    </div> : null}
                    <div ref="uploadContainer">
                        <div ref="selectfiles"
                            className="ant-upload ant-upload-select ant-upload-select-picture-card">
                            <div ref="postfiles"></div>
                            {uploadButton}
                        </div>
                    </div>
                </div>
            )
        }
    }

    render () {
        const {previewVisible, previewImage} = this.state;
        return (
            <div className="upload-pic">
                <div>
                    <div className="clearfix">
                        <span>
                            {this.renderItem()}
                        </span>
                    </div>
                </div>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

UploadPic.defaultProps = {
    localName: false,
    multiple: false,
    dir: '',
    filter: '',
    rdir: false,
    suffix: false,
    autoStart: true,
    showImg: true,
    showTextArea: false,
    eachCallback: (filename)=> {
        // console.log(filename)
    },
    maxSize: 20,
    extensions: "jpg",
    bucket: SETTINGS.OSS.bucket,
    region: SETTINGS.OSS.region,
    name: SETTINGS.OSS.name,
    token: SETTINGS.OSS.token,
    btnName: '上传'
};