import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import styles from './Home.module.css';
import * as ImagesActions from '../actions/images';
import Image from './Image';

import { remote } from 'electron';
const dialog = remote.require('dialog');

import fs  from 'fs';
import path from 'path';
import request  from 'request';
import progress  from 'request-progress';

class Home extends Component {
  static propTypes = {
    loadImgurImages: PropTypes.func.isRequired,
    imgur: PropTypes.object
  }

  handleOnKeyDown(e) {
    const { loadImgurImages } = this.props;

    if (e.key === 'Enter') {
      var imgurUrl = e.target.value.trim();
      loadImgurImages(imgurUrl);
    }
  }

  renderImage(image) {
    return(
      <Image imageData={ image } id={ image.id }/>
    );
  }

  handleSaveClick() {
    const { imgur } = this.props;

    dialog.showOpenDialog(
      remote.getCurrentWindow(),
      { properties: [ 'openDirectory', 'createDirectory' ]},
      (dirname) => {
        imgur.images.map((image, index) => {
          var basename = path.basename(image.link);

          progress(request(image.link), {
            lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
          }).on('progress', state => {
            // console.log(`received size in bytes`, state.received);
            // The properties bellow can be null if response does not contain
            // the content-length header
            // console.log(`total size in bytes`, state.total);
            // console.log(`percent`, state.percent);
            // console.log(`eta`, state.eta);
          }).on('error', err => {
            console.error(err);
          }).on('end', () => {
            // handle done action
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
              onKeyDown={ this.handleOnKeyDown.bind(this) }/>
            <button className={styles.saveButton} onClick={this.handleSaveClick.bind(this)}>
              <i className="fa fa-cloud-download"/>
              {' Save to'}
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
