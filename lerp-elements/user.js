"use strict";

class User {
  constructor() {

  }

  roles: { type: Array },
  perms: { type: Array }

  /**
   * r дүр байгаа эсэхийг шалгах
   */
  hasRole(String r) {
    return (this.roles && this.roles.contains(r));
  },

  /**
   * roles1 дүрүүд байгаа эсэхийг шалгах, дүрийн нэрэнд * ашиглаж болно
   */
  bool matchRole(List roles1) {
    if (!roles) {
      return false;
    }

    for (String r in roles1) {
      // wildcard тооцох
      if (r.endsWith("*")) {
        r = r.substring(0, r.length - 1);
        for (String r1 in roles) {
          if (r1.startsWith(r)) {
            return true;
          }
        }
      } else if (this.roles.contains(r)) {
        return true;
      }
    }
    return false;
  }
}
