import fs  from 'fs';
import path from 'path';
import http from 'http';
import request  from 'request';

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { remote } from 'electron';
const dialog = remote.require('dialog');

import styles from './Home.module.css';
import * as ImagesActions from '../actions/images';
import Image from './Image';


class Home extends Component {
  static propTypes = {
    loadImgurImages: PropTypes.func.isRequired,
    updateDownloadProgress: PropTypes.func.isRequired,
    imgur: PropTypes.object
  }

  handleOnKeyDown = (e) => {
    const { loadImgurImages } = this.props;

    if (e.key === 'Enter') {
      var imgurUrl = e.target.value.trim();
      loadImgurImages(imgurUrl);
    }
  }

  renderImage(image) {
    return(
      <Image key={image.id} imageData={ image } id={ image.id }/>
    );
  }

  handleSaveClick = () => {
    const { imgur, updateDownloadProgress } = this.props;

    dialog.showOpenDialog(
      remote.getCurrentWindow(),
      { properties: [ 'openDirectory', 'createDirectory' ]},
      (dirname) => {
        if (typeof(imgur.images) === 'undefined') {
          return;
        }
        imgur.images.map((image, index) => {
          var basename = path.basename(image.link);

          request.get(image.link).on('response', response => {
            var total = 0;
            var len = parseInt(response.headers['content-length'], 10);

            response.on('data', chunk => {
              total += chunk.length;
              var progress = parseInt(total/len * 100);

              if (progress % 10 == 0) {
                updateDownloadProgress(image.id, progress);
              }
            });

            response.on('end', () => {
              updateDownloadProgress(image.id, 100);
            });

          }).pipe(fs.createWriteStream(path.join(dirname[0], `${index+1}-${basename}`)));

        })
      }
    );
  }

  render() {
    const { imgur } = this.props;

    return (
      <div>
        <div className={ styles.container }>
          <div className={ styles.actionItems }>
            <input type="text" className={ styles.input }
              placeholder="paste imgur url here"
              onKeyDown={this.handleOnKeyDown}/>
            <button className={styles.saveButton} onClick={this.handleSaveClick}>
              <i className="fa fa-cloud-download"/>
              {' Save'}
            </button>
          </div>
          <div className={ styles.albumContainer }>
            { imgur.images ? imgur.images.map(this.renderImage) : null }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ImagesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
