const expect = require('chai').expect
const vultr = require('../../src/index')
const config = require('../config')
const nock = require('nock')

const mock = {
  create: { ISOID: 24 },
  list: {
    '24': {
      ISOID: 24,
      date_created: '2014-04-01 14:10:09',
      filename: 'CentOS-6.5-x86_64-minimal.iso',
      size: 9342976,
      md5sum: 'ec0669895a250f803e1709d0402fc411',
      sha512sum:
        '1741f890bce04613f60b4f2b16fb8070c31640c53d4dbb4271b22610150928743eda1207f031b0b5bdd240ef1a6ed21fd5e6a2d192b9c87eff60b6d9698b8260',
      status: 'complete'
    }
  },
  listPublic: {
    '494966': {
      ISOID: 494966,
      name: 'Arch Linux',
      description: '2018.10.01 x86_64'
    },
    '507903': {
      ISOID: 507903,
      name: 'OpenBSD 6.4',
      description: 'amd64'
    },
    '522881': {
      ISOID: 522881,
      name: 'Ubuntu 18.10',
      description: '18.10 x86_64'
    }
  }
}

describe('iso', () => {
  describe('create({ url })', () => {
    beforeEach(() => {
      nock(config.baseUrl, config.headers)
        .post('/v1/iso/create_from_url', {
          url: 'https://templeos.org/Downloads/TempleOSLite.ISO'
        })
        .reply(200, mock.create)
    })

    it('requires an API key', () => {
      const vultrInstance = vultr.initialize()
      expect(() => {
        vultrInstance.iso.create({
          url: 'https://templeos.org/Downloads/TempleOSLite.ISO'
        })
      }).to.throw(Error)
    })

    it('requires all non-optional parameters', () => {
      const vultrInstance = vultr.initialize({ apiKey: config.apiKey })
      expect(() => {
        vultrInstance.iso.create()
      }).to.throw(Error)
    })

    it('creates a private ISO', () => {
      const vultrInstance = vultr.initialize({ apiKey: config.apiKey })
      return vultrInstance.iso
        .create({ url: 'https://templeos.org/Downloads/TempleOSLite.ISO' })
        .then(response => {
          expect(typeof response).to.equal('object')
          expect(response).to.deep.equal(mock.create)
        })
    })
  })

  describe('delete({ ISOID })', () => {
    beforeEach(() => {
      nock(config.baseUrl, config.headers)
        .post('/v1/iso/destroy', { ISOID: 24 })
        .reply(200, undefined)
    })

    it('requires an API key', () => {
      const vultrInstance = vultr.initialize()
      expect(() => {
        vultrInstance.iso.delete({ ISOID: 24 })
      }).to.throw(Error)
    })

    it('requires all non-optional parameters', () => {
      const vultrInstance = vultr.initialize({ apiKey: config.apiKey })
      expect(() => {
        vultrInstance.iso.delete()
      }).to.throw(Error)
    })

    it('deletes a private ISO', () => {
      const vultrInstance = vultr.initialize({ apiKey: config.apiKey })
      return vultrInstance.iso.delete({ ISOID: 24 }).then(response => {
        expect(typeof response).to.equal('undefined')
      })
    })
  })

  describe('list()', () => {
    beforeEach(() => {
      nock(config.baseUrl, config.headers)
        .get('/v1/iso/list')
        .reply(200, mock.list)
    })

    it('requires an API key', () => {
      const vultrInstance = vultr.initialize()
      expect(() => {
        vultrInstance.iso.list()
      }).to.throw(Error)
    })

    it('gets the list of private ISOs', () => {
      const vultrInstance = vultr.initialize({ apiKey: config.apiKey })
      return vultrInstance.iso.list().then(response => {
        expect(typeof response).to.equal('object')
        expect(response).to.deep.equal(mock.list)
      })
    })
  })

  describe('listPublic()', () => {
    beforeEach(() => {
      nock(config.baseUrl, config.headers)
        .get('/v1/iso/list_public')
        .reply(200, mock.listPublic)
    })

    it('requires an API key', () => {
      const vultrInstance = vultr.initialize()
      expect(() => {
        vultrInstance.iso.listPublic()
      }).to.throw(Error)
    })

    it('gets the list of public ISOs', () => {
      const vultrInstance = vultr.initialize({ apiKey: config.apiKey })
      return vultrInstance.iso.listPublic().then(response => {
        expect(typeof response).to.equal('object')
        expect(response).to.deep.equal(mock.listPublic)
      })
    })
  })
})
