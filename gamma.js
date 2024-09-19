function Fgamma(m,x){
    // """
    // Incomplete gamma function
    // >>> np.isclose(Fgamma(0,0),1.0)
    // True
    // """
    let SMALL=1e-12;
    let x = max(x,SMALL);
    return 0.5*Math.pow(x,-m-0.5)*gamm_inc(m+0.5,x)
  }

function gamm_inc(a,x){
    // """
    // Incomple gamma function \gamma; computed from NumRec routine gammp.
    // >>> np.isclose(gamm_inc(0.5,1),1.49365)
    // True
    // >>> np.isclose(gamm_inc(1.5,2),0.6545103)
    // True
    // >>> np.isclose(gamm_inc(2.5,1e-12),0)
    // True
    // """
    console.assert (x > 0 && a >= 0)

    let gam,gln;

    if x < (a+1.0): #Use the series representation
        gam,gln = _gser(a,x)
    else: #Use continued fractions
        gamc,gln = _gcf(a,x)
        gam = 1-gamc
    return Math.exp(gln)*gam
  }

function _gser(a,x){
    // "Series representation of Gamma. NumRec sect 6.1."
    let ITMAX=100
    let EPS=3.e-7

    let gln=lgamma(a)
    console.assert(x>=0)
    if x == 0 : return 0,gln

    let ap = a
    let delt = 1./a, sum=delt;

    for (let i=0; i<ITMAX; i++){
        ap += 1
        delt *= (x/ap)
        sum += delt
        if (Math.abs(delt) < Math.abs(sum)*EPS) break;
    }
    let gamser=sum*Math.exp(-x+a*Math.log(x)-gln)
    return gamser,gln
  }

function _gcf(a,x){
    // "Continued fraction representation of Gamma. NumRec sect 6.1"
    let ITMAX=100,
      EPS=3.e-7,
      FPMIN=1.e-30;

    let gln=lgamma(a)
    let b=x+1.-a
    let c=1./FPMIN
    let d=1./b
    let h=d
    for (i=1; i<ITMAX+1; i++){
        let an=-i*(i-a)
        b=b+2.
        d=an*d+b
        if Math.abs(d) < FPMIN: d=FPMIN
        c=b+an/c
        if Math.abs(c) < FPMIN: c=FPMIN
        d=1./d
        delt=d*c
        h=h*delt
        if (Math.abs(delt-1.) < EPS) break;
    }
    let gammcf=Math.exp(-x+a*Math.log(x)-gln)*h
    return gammcf,gln
  }
